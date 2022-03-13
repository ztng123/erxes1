import { debug } from '../../configs';
import { getDocument } from '../../cacheUtils';
import { IMessageDocument } from '../../models/definitions/conversationMessages';
import { MESSAGE_TYPES } from '../../models/definitions/constants';
import { sendIntegrationsMessage } from '../../messageBroker';
import { IContext } from '../../connectionResolver';

export default {
  user(message: IMessageDocument) {
    return message.userId && { __typename: 'User', _id: message.userId }
  },

  customer(message: IMessageDocument) {
    return message.customerId && { __typename: 'Customer', _id: message.customerId }
  },

  async mailData(message: IMessageDocument, _args, { models, coreModels, subdomain }: IContext ) {
    const conversation = await models.Conversations.findOne({
      _id: message.conversationId
    }).lean();

    if (!conversation || message.internal) {
      return null;
    }

    const integration = await getDocument(models, coreModels, subdomain, 'integrations', {
      _id: conversation.integrationId
    });

    if (!integration) {
      return null;
    }

    const { kind } = integration;

    // Not mail
    if (!kind.includes('nylas') && kind !== 'gmail') {
      return null;
    }

    const path = kind.includes('nylas')
      ? `/nylas/get-message`
      : `/${kind}/get-message`;

    // ! below msg converted
    // return sendRPCMessage('rpc_queue:api_to_integrations', {
    //   action: 'getMessage',
    //   data: {
    //     erxesApiMessageId: message._id,
    //     integrationId: integration._id,
    //     path
    //   }
    // })
    return sendIntegrationsMessage({
      subdomain,
      action: 'api_to_integrations',
      data: {
        action: 'getMessage',
        erxesApiMessageId: message._id,
        integrationId: integration._id,
        path
      },
      isRPC: true
    });
  },

  async videoCallData(
    message: IMessageDocument,
    _args,
    { models, subdomain }: IContext
  ) {
    const conversation = await models.Conversations.findOne({
      _id: message.conversationId
    }).lean();

    if (!conversation || message.internal) {
      return null;
    }

    if (message.contentType !== MESSAGE_TYPES.VIDEO_CALL) {
      return null;
    }

    try {
      // ! below msg converted
      // const response = await sendRPCMessage('integrations:rpc_queue:getDailyRoom', {
      //   erxesApiMessageId: message._id
      // })

      const response = await sendIntegrationsMessage({
        subdomain,
        action: "getDailyRoom",
        data: {
          erxesApiMessageId: message._id
        },
        isRPC: true
      })

      return response;
    } catch (e) {
      debug.error(e);
      return null;
    }
  }
};