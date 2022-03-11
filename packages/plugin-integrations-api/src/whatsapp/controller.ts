import { routeErrorHandling } from '../helpers';
import { Integrations } from '../models';
import * as whatsappUtils from './api';
import { ConversationMessages, Conversations } from './models';
import receiveMessage from './receiveMessage';

export const whatsappReply = async (doc) => {
  
  const { attachments, conversationId, content, integrationId } = doc;

  const conversation = await Conversations.getConversation({
    erxesApiId: conversationId
  });

  const recipientId = conversation.recipientId;
  const instanceId = conversation.instanceId;

  const integration = await Integrations.findOne({
    erxesApiId: integrationId
  });

  if(!integration) {
    throw new Error('Integration not found');
  }

  const token = integration.whatsappToken || '';

  if (attachments.length !== 0) {
    for (const attachment of attachments) {
      const file = {
        receiverId: recipientId,
        body: attachment.url,
        filename: attachment.name,
        caption: content,
        instanceId,
        token
      };
      try {
        await whatsappUtils.sendFile(file);
      } catch (e) {
        throw new Error(e);
      }
    }
  } else {
    try {
      const message = await whatsappUtils.reply(
        recipientId,
        content,
        instanceId,
        token
      );

      await ConversationMessages.create({
        conversationId: conversation._id,
        mid: message.id,
        content
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  return 'success';
}

export const whatsappCreateIntegration = async ({ integrationId, data }) => {
  const { instanceId, token } = JSON.parse(data);

  await whatsappUtils.saveInstance(integrationId, instanceId, token);

  return { status: 'ok' };
}

const init = async app => {
  app.post(
    '/whatsapp/webhook',
    routeErrorHandling(async (req, res) => {
      await receiveMessage(req.body);

      res.sendStatus(200);
    })
  );
};

export default init;
