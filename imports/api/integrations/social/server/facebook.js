import graph from 'fbgraph';
import { Picker } from 'meteor/meteorhacks:picker';
import { Meteor } from 'meteor/meteor';
import { apolloNotifyNewMessage } from '/imports/api/server/utils';
import { Conversations } from '/imports/api/conversations/conversations';
import { Messages } from '/imports/api/conversations/messages';
import { Customers } from '/imports/api/customers/customers';
import { Integrations } from '/imports/api/integrations/integrations';
import { KIND_CHOICES } from '/imports/api/integrations/constants';
import { CONVERSATION_STATUSES, FACEBOOK_DATA_KINDS } from '/imports/api/conversations/constants';

/*
 * Common graph api request wrapper
 * catchs auth token or other type of exceptions
 */
export const graphRequest = {
  base(method, path, accessToken, ...otherParams) {
    // set access token
    graph.setAccessToken(accessToken);

    const wrappedGraph = Meteor.wrapAsync(graph[method], graph);

    try {
      return wrappedGraph(path, ...otherParams);

      // catch session expired or some other error
    } catch (e) {
      console.log(e.message); // eslint-disable-line no-console
      return e.message;
    }
  },

  get(...args) {
    return this.base('get', ...args);
  },

  post(...args) {
    return this.base('post', ...args);
  },
};

/*
 * get list of pages that authorized user owns
 */
export const getPageList = accessToken => {
  const response = graphRequest.get('/me/accounts?limit=100', accessToken);

  return response.data.map(page => ({
    id: page.id,
    name: page.name,
  }));
};

/*
 * save webhook response
 * create conversation, customer, message using transmitted data
 */

export class SaveWebhookResponse {
  constructor(userAccessToken, integration, data) {
    this.userAccessToken = userAccessToken;

    this.integration = integration;

    // received facebook data
    this.data = data;

    this.currentPageId = null;
  }

  start() {
    const data = this.data;
    const integration = this.integration;

    if (data.object === 'page') {
      data.entry.forEach(entry => {
        // check receiving page is in integration's page list
        if (!integration.facebookData.pageIds.includes(entry.id)) {
          return;
        }

        // set current page
        this.currentPageId = entry.id;

        // receive new messenger message
        if (entry.messaging) {
          this.viaMessengerEvent(entry);
        }

        // receive new feed
        if (entry.changes) {
          this.viaFeedEvent(entry);
        }
      });
    }
  }

  // via page messenger
  viaMessengerEvent(entry) {
    entry.messaging.forEach(messagingEvent => {
      // someone sent us a message
      if (messagingEvent.message) {
        this.getOrCreateConversationByMessenger(messagingEvent);
      }
    });
  }

  // wall post
  viaFeedEvent(entry) {
    entry.changes.forEach(event => {
      // someone posted on our wall
      this.getOrCreateConversationByFeed(event.value);
    });
  }

  // common get or create conversation helper using both in messenger and feed
  getOrCreateConversation(params) {
    // extract params
    const {
      findSelector,
      status,
      senderId,
      facebookData,
      content,
      attachments,
      msgFacebookData,
    } = params;

    let conversation = Conversations.findOne({
      ...findSelector,
    });

    // create new conversation
    if (!conversation) {
      const conversationId = Conversations.insert({
        integrationId: this.integration._id,
        customerId: this.getOrCreateCustomer(senderId),
        status,
        content,

        // save facebook infos
        facebookData: {
          ...facebookData,
          pageId: this.currentPageId,
        },
      });
      conversation = Conversations.findOne(conversationId);

      // update conversation
    } else {
      Conversations.update(
        { _id: conversation._id },
        {
          $set: {
            // reset read history
            readUserIds: [],

            // if closed, reopen it
            status: CONVERSATION_STATUSES.OPEN,
          },
        },
      );
    }

    // create new message
    this.createMessage({
      conversation,
      userId: senderId,
      content,
      attachments,
      facebookData: msgFacebookData,
    });
  }

  // get or create new conversation by feed info
  getOrCreateConversationByFeed(value) {
    const commentId = value.comment_id;

    // collect only added actions
    if (value.verb !== 'add') {
      return;
    }

    // ignore duplicated action when like
    if (value.verb === 'add' && value.item === 'like') {
      return;
    }

    // if this is already saved then ignore it
    if (commentId && Messages.findOne({ 'facebookData.commentId': commentId })) {
      return;
    }

    const senderName = value.sender_name;

    // sender_id is giving number values when feed and giving string value
    // when messenger. customer.facebookData.senderId has type of string so
    // convert it to string
    const senderId = value.sender_id.toString();

    let messageText = value.message;

    // when photo, video share, there will be no text, so link instead
    if (!messageText && value.link) {
      messageText = value.link;
    }

    // when situations like checkin, there will be no text and no link
    // if so ignore it
    if (!messageText) {
      return;
    }

    // value.post_id is returning different value even though same post
    // with the previous one. So fetch post info via graph api and
    // save returned value. This value will always be the same
    let postId = value.post_id;

    // get page access token
    let response = graphRequest.get(
      `${this.currentPageId}/?fields=access_token`,
      this.userAccessToken,
    );

    // acess token expired
    if (response === 'Error processing https request') {
      return;
    }

    // get post object
    response = graphRequest.get(postId, response.access_token);

    postId = response.id;

    let status = CONVERSATION_STATUSES.NEW;

    // if we are posting from our page, close it automatically
    if (this.integration.facebookData.pageIds.includes(senderId)) {
      status = CONVERSATION_STATUSES.CLOSED;
    }

    this.getOrCreateConversation({
      findSelector: {
        'facebookData.kind': FACEBOOK_DATA_KINDS.FEED,
        'facebookData.postId': postId,
      },
      status,
      senderId,
      facebookData: {
        kind: FACEBOOK_DATA_KINDS.FEED,
        senderId,
        senderName,
        postId,
      },

      // message data
      content: messageText,
      msgFacebookData: {
        senderId,
        senderName,
        item: value.item,
        reactionType: value.reaction_type,
        photoId: value.photo_id,
        videoId: value.video_id,
        link: value.link,
      },
    });
  }

  // get or create new conversation by page messenger
  getOrCreateConversationByMessenger(event) {
    const senderId = event.sender.id;
    const senderName = event.sender.name;
    const recipientId = event.recipient.id;
    const messageText = event.message.text || 'attachment';

    // collect attachment's url, type fields
    const attachments = (event.message.attachments || []).map(attachment => ({
      type: attachment.type,
      url: attachment.payload ? attachment.payload.url : '',
    }));

    this.getOrCreateConversation({
      // try to find conversation by senderId, recipientId keys
      findSelector: {
        'facebookData.kind': FACEBOOK_DATA_KINDS.MESSENGER,
        $or: [
          {
            'facebookData.senderId': senderId,
            'facebookData.recipientId': recipientId,
          },
          {
            'facebookData.senderId': recipientId,
            'facebookData.recipientId': senderId,
          },
        ],
      },
      status: CONVERSATION_STATUSES.NEW,
      senderId,
      facebookData: {
        kind: FACEBOOK_DATA_KINDS.MESSENGER,
        senderId,
        senderName,
        recipientId,
      },

      // message data
      content: messageText,
      attachments,
      msgFacebookData: {},
    });
  }

  // get or create customer using facebook data
  getOrCreateCustomer(fbUserId) {
    const integrationId = this.integration._id;

    const customer = Customers.findOne({
      integrationId,
      'facebookData.id': fbUserId,
    });

    if (customer) {
      return customer._id;
    }

    // get page access token
    let res = graphRequest.get(`${this.currentPageId}/?fields=access_token`, this.userAccessToken);

    // get user info
    res = graphRequest.get(`/${fbUserId}`, res.access_token);

    // when feed response will contain name field
    // when messeger response will not contain name field
    const name = res.name || `${res.first_name} ${res.last_name}`;

    // create customer
    return Customers.insert({
      name,
      integrationId,
      facebookData: {
        id: fbUserId,
        profilePic: res.profile_pic,
      },
    });
  }

  createMessage({ conversation, userId, content, attachments, facebookData }) {
    if (conversation) {
      // create new message
      const messageId = Messages.insert({
        conversationId: conversation._id,
        customerId: this.getOrCreateCustomer(userId),
        content,
        attachments,
        facebookData,
        internal: false,
      });

      // notify subscription server new message
      apolloNotifyNewMessage(messageId);

      return messageId;
    }
  }
}

/*
 * receive per app webhook response
 */
export const receiveWebhookResponse = (app, data) => {
  const selector = {
    kind: KIND_CHOICES.FACEBOOK,
    'facebookData.appId': app.id,
  };

  Integrations.find(selector).forEach(integration => {
    // when new message or other kind of activity in page
    const saveWebhookResponse = new SaveWebhookResponse(app.accessToken, integration, data);

    saveWebhookResponse.start();
  });
};

Meteor.settings.services.facebook.forEach(app => {
  Picker.route(`/service/facebook/${app.id}/webhook-callback`, (params, req, res) => {
    const query = params.query;

    // when the endpoint is registered as a webhook, it must echo back
    // the 'hub.challenge' value it receives in the query arguments
    if (query['hub.mode'] === 'subscribe' && query['hub.challenge']) {
      if (query['hub.verify_token'] !== app.verifyToken) {
        res.end('Verification token mismatch');
      }

      res.end(query['hub.challenge']);
    }

    res.statusCode = 200;

    // receive per app webhook response
    receiveWebhookResponse(app, req.body);

    res.end('success');
  });
});

/*
 * post reply to page conversation or comment to wall post
 */
export const facebookReply = (conversation, text, messageId) => {
  const app = Meteor.settings.services.facebook.find(
    a => a.id === conversation.integration().facebookData.appId,
  );

  // page access token
  const response = graphRequest.get(
    `${conversation.facebookData.pageId}/?fields=access_token`,
    app.accessToken,
  );

  // messenger reply
  if (conversation.facebookData.kind === FACEBOOK_DATA_KINDS.MESSENGER) {
    return graphRequest.post(
      'me/messages',
      response.access_token,
      {
        recipient: { id: conversation.facebookData.senderId },
        message: { text },
      },
      () => {},
    );
  }

  // feed reply
  if (conversation.facebookData.kind === FACEBOOK_DATA_KINDS.FEED) {
    const postId = conversation.facebookData.postId;

    // post reply
    const commentResponse = graphRequest.post(`${postId}/comments`, response.access_token, {
      message: text,
    });

    // save commentId in message object
    Messages.update({ _id: messageId }, { $set: { 'facebookData.commentId': commentResponse.id } });
  }

  return null;
};
