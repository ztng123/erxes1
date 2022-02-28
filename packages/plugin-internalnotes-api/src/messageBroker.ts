import { getSchemaLabels } from '@erxes/api-utils/src/logUtils';

import { InternalNotes } from "./models";
import { serviceDiscovery } from './configs';
import { internalNoteSchema } from './models/definitions/internalNotes'

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeQueue, consumeRPCQueue } = cl;

  consumeQueue('internalNotes:batchUpdate', async ({contentType, oldContentTypeIds, newContentTypeId}) => {
    // Updating every internal notes of company
    await InternalNotes.updateMany(
      {
        contentType,
        contentTypeId: { $in: oldContentTypeIds || [] }
      },
      { contentTypeId: newContentTypeId }
    );
  });

  consumeRPCQueue('internalnotes:rpc_queue:activityLog:collectItems', async ({ contentId }) => {
    const notes = await InternalNotes.find({ contentTypeId: contentId }).sort({ createdAt: -1 });
    const results: any[] = [];

    for (const note of notes) {
      results.push({
        _id: note._id,
        contentType: 'note',
        contentId,
        createdAt: note.createdAt,
      });
    }

    return {
      status: 'success',
      data: results
    };
  });

  consumeRPCQueue('internalnotes:rpc_queue:getInternalNotes', async ({ contentTypeIds, perPageForAction, page }) => {
    const filter = { contentTypeId: { $in: contentTypeIds } };

    const internalNotes = await InternalNotes.find(filter)
      .sort({
        createdAt: -1
      })
      .skip(perPageForAction * (page - 1))
      .limit(perPageForAction);

    return { internalNotes, totalCount: await InternalNotes.countDocuments(filter) };
  });

  consumeRPCQueue('internalnotes:rpc_queue:logs:getSchemaLabels', async ({ type }) => ({
    status: 'success',
    data: getSchemaLabels(type, [{ name: 'internalNote', schemas: [internalNoteSchema] }])
  }));

  consumeQueue('internalnotes:InternalNotes.removeInternalNotes', ({ contentType, contentTypeIds }) => {
    InternalNotes.removeInternalNotes(contentType, contentTypeIds);
  });
};

export const sendNotificationMessage = async (
  action,
  data,
  isRPC?: boolean,
  defaultValue?
): Promise<any> => {
  if (isRPC) {
    if (!await serviceDiscovery.isAvailable('notifications')) {
      return defaultValue;
    }

    return client.sendRPCMessage(`notifications:rpc_queue:${action}`, data);
  }

  return client.sendMessage(`notifications:${action}`, data);
};

export const sendRPCMessage = async (channel, message): Promise<any> => {
  return client.sendRPCMessage(channel, message);
};

export const findCardItem = async (data) => {
  if (!await serviceDiscovery.isAvailable('cards')) {
    return null;
  }

  return client.sendRPCMessage('cards:rpc_queue:findCardItem', data);
};

export default function() {
  return client;
}
