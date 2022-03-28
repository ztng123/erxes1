import * as momentTz from 'moment-timezone';

import { IIntegrationDocument } from '../../models/definitions/integrations';

import { getOrCreateEngageMessage } from '../../widgetUtils';

import * as fs from 'fs';
import * as moment from 'moment';

// ? import { uploadFile, frontendEnv, getSubServiceDomain } from '@erxes/api-utils';

import { IBrowserInfo } from '@erxes/api-utils/src/definitions/common';
import { sendCoreMessage, sendFormsMessage, sendKnowledgeBaseMessage } from '../../messageBroker';
import { IContext, ICoreIModels, IModels } from '../../connectionResolver';

export const isMessengerOnline = async (models: IModels, integration: IIntegrationDocument) => {
  if (!integration.messengerData) {
    return false;
  }

  const {
    availabilityMethod,
    isOnline,
    onlineHours,
    timezone
  } = integration.messengerData;

  const modifiedIntegration = {
    ...(integration.toJSON ? integration.toJSON() : integration),
    messengerData: {
      availabilityMethod,
      isOnline,
      onlineHours,
      timezone
    }
  };

  return models.Integrations.isOnline(modifiedIntegration);
};

const messengerSupporters = async (subdomain: string, integration: IIntegrationDocument) => {
  const messengerData = integration.messengerData || { supporterIds: [] };

  return sendCoreMessage({
    subdomain,
    action: "users.find",
    data: {
      query: {
         _id: { $in: messengerData.supporterIds } 
      }
    },
    isRPC: true,
    defaultValue: []
  })
};

const getWidgetMessages = (models: IModels,conversationId: string) => {
  return models.ConversationMessages.find({
    conversationId,
    internal: false,
    fromBot: { $exists: false }
  }).sort({
    createdAt: 1
  });
};

const getExportMessages = (models: IModels, conversationId: string) => {
  return models.ConversationMessages.aggregate([
    {
      $match: {
        conversationId,
        internal: false,
        fromBot: { $exists: false }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'customers',
        localField: 'customerId',
        foreignField: '_id',
        as: 'customer'
      }
    },
    { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        createdAt: 1,
        'user.details.fullName': 1,
        content: 1,
        'customer.emails': 1
      }
    },
    { $sort: { createdAt: 1 } }
  ]);
};

const writeMessagesToFile = async (
  createdAt: any,
  messages: any,
  fileName: string
) => {
  return await new Promise<void>(resolve => {
    const stream = fs.createWriteStream(fileName);
    stream.once('open', () => {
      stream.write(`Conversation with Erxes\nStarted on ${createdAt}\n---\n`);
      for (const mg of messages) {
        stream.write(
          `${moment(mg.createdAt).format('LT')} | ${
            mg.user ? mg.user?.details?.fullName : mg.customer?.emails?.[0]
          } | ${mg.content}\n`
        );
      }
      stream.write(`---\nExported from Erxes on ${new Date()}`);
      stream.end();
    });

    stream.on('finish', resolve);
  });
};

export default {
  async widgetExportMessengerData(
    _root,
    args: { _id: string; integrationId: string },
    { requestInfo, models }: IContext
  ) {
    const { _id, integrationId } = args;

    const conversation = await models.Conversations.findOne({
      _id,
      integrationId
    }).lean();
    const integration = await models.Integrations.findOne({
      _id: integrationId
    }).lean();

    if (!conversation || !integration) {
      return null;
    }

    // aggregating conversation message with user, customer collections.
    const messages = await getExportMessages(models, conversation._id);

    const fileName = `EXPORTED_CONVERSATIONS.txt`;
    const newPath = `${fileName}`;

    // writing data to text file.
    await writeMessagesToFile(conversation.createdAt, messages, fileName);

    // ? const API_URL = frontendEnv({ name: 'API_URL', requestInfo });
    // ? const API_DOMAIN = API_URL || getSubServiceDomain({ name: 'API_DOMAIN' });

    // uploading a file to the server (aws, gcs, local).
    try {
      const file = {
        name: fileName,
        path: newPath,
        type: 'text/plain'
      };
      // ? const result = await uploadFile(API_DOMAIN, file, false);
      const result = '';

      // removing temporary written file.
      await fs.unlinkSync(fileName);

      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  },

  widgetsGetMessengerIntegration(_root, args: { brandCode: string }, { models }: IContext) {
    return models.Integrations.getWidgetIntegration(args.brandCode, 'messenger');
  },

  widgetsConversations(
    _root,
    args: { integrationId: string; customerId?: string; visitorId?: string },
    { models }: IContext
  ) {
    const { integrationId, customerId, visitorId } = args;

    const query = customerId
      ? { integrationId, customerId }
      : { integrationId, visitorId };

    return models.Conversations.find(query).sort({ updatedAt: -1 });
  },

  async widgetsConversationDetail(
    _root,
    args: { _id: string; integrationId: string },
    { models, coreModels, subdomain }: IContext
  ) {
    const { _id, integrationId } = args;

    const conversation = await models.Conversations.findOne({ _id, integrationId });
    const integration = await models.Integrations.findOne({
      _id: integrationId
    });

    // When no one writes a message
    if (!conversation && integration) {
      return {
        messages: [],
        isOnline: await isMessengerOnline(models, integration)
      };
    }

    if (!conversation || !integration) {
      return null;
    }

    return {
      _id,
      messages: await getWidgetMessages(models, conversation._id),
      isOnline: await isMessengerOnline(models, integration),
      operatorStatus: conversation.operatorStatus,
      participatedUsers: await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: {
            _id: { $in: conversation.participatedUserIds }
          }
        },
        isRPC: true,
        defaultValue: []
      }),
      supporters: await messengerSupporters(subdomain, integration)
    };
  },

  widgetsMessages(_root, args: { conversationId: string }, { models }: IContext) {
    const { conversationId } = args;

    return getWidgetMessages(models, conversationId);
  },

  widgetsUnreadCount(_root, args: { conversationId: string }, { models }: IContext) {
    const { conversationId } = args;

    return models.ConversationMessages.widgetsGetUnreadMessagesCount(conversationId);
  },

  async widgetsTotalUnreadCount(
    _root,
    args: { integrationId: string; customerId?: string },
    { models }: IContext
  ) {
    const { integrationId, customerId } = args;

    if (!customerId) {
      return 0;
    }
    // find conversations
    const convs = await models.Conversations.find({ integrationId, customerId });

    // find read messages count
    return models.ConversationMessages.countDocuments(
      models.Conversations.widgetsUnreadMessagesQuery(convs)
    );
  },

  async widgetsMessengerSupporters(
    _root,
    { integrationId }: { integrationId: string },
    { models, subdomain }: IContext
  ) {
    const integration = await models.Integrations.findOne({
      _id: integrationId
    });

    let timezone = '';

    if (!integration) {
      return {
        supporters: [],
        isOnline: false,
        serverTime: momentTz().tz()
      };
    }

    const messengerData = integration.messengerData || { supporterIds: [] };

    if (integration.messengerData && integration.messengerData.timezone) {
      timezone = integration.messengerData.timezone;
    }

    return {
      supporters: await sendCoreMessage({
        subdomain,
        action: 'users.find',
        data: {
          query: {
            _id: { $in: messengerData.supporterIds || [] }
          }
        },
        isRPC: true,
        defaultValue: []
      }),
      isOnline: await isMessengerOnline(models, integration),
      serverTime: momentTz().tz(timezone)
    };
  },

  async widgetsGetEngageMessage(
    _root,
    {
      integrationId,
      customerId,
      visitorId,
      browserInfo
    }: {
      integrationId: string;
      customerId?: string;
      visitorId?: string;
      browserInfo: IBrowserInfo;
    },
    { models, subdomain }: IContext
  ) {
    return getOrCreateEngageMessage(
      models,
      subdomain,
      integrationId,
      browserInfo,
      visitorId,
      customerId
    );
  },

  async widgetsProductCategory(_root, { _id }: { _id: string }) {
    return {
      __typename: 'ProductCategory',
      _id
    };
  },

  async widgetsBookingProductWithFields(_root, { _id }: { _id: string }, { subdomain }: IContext) {
    const fields = await sendFormsMessage({
      subdomain,
      action: 'fields.find',
      data: {
        query: {
          contentType: 'product'
        },
        sort: {
          order: 1
        }
      },
      isRPC: true
    });

    return {
      fields: fields.map(field => {
        return {
          __typename: 'Field',
          _id: field._id
        };
      }),
      product: {
        __typename: 'Product',
        _id
      }
    };
  },
  
  /*
   * Search published articles that contain searchString (case insensitive)
   * in a topic found by topicId
   * @return {Promise} searched articles
   */
  async widgetsKnowledgeBaseArticles(
    _root: any,
    args: { topicId: string; searchString: string },
    { subdomain }: IContext
  ) {
    const { topicId, searchString = '' } = args;

    return sendKnowledgeBaseMessage({
      subdomain,
      action: 'articles.find',
      data: {
        query: {
          topicId,
          content: { $regex: `.*${searchString.trim()}.*`, $options: 'i' },
          status: 'publish'
        }
      },
      isRPC: true
    });

  },

    /*  
     * Topic detail
     */
     async widgetsKnowledgeBaseTopicDetail(_root, { _id }: { _id: string }, { subdomain }: IContext) {
      const topic = await sendKnowledgeBaseMessage({
        subdomain,
        action: "topics.findOne",
        data: {
          query:{
            _id
          }
        },
        isRPC: true
      })
  
      if (topic && topic.createdBy) {
        const user = await sendCoreMessage({
          subdomain,
          action: 'users.findOne',
          data: {
            _id: topic.createdBy
          },
          isRPC: true,
          defaultValue: {}
        });

        sendCoreMessage({
          subdomain,
          action: 'registerOnboardHistory',
          data: {
            type: 'knowledgeBaseInstalled',
            user
          }
        });
      }
  
      return topic;
    },
  

};
