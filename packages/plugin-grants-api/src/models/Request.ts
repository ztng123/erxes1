import { Model } from 'mongoose';
import { IGrantRequestDocument, grantSchema } from './definitions/grant';
import { IModels } from '../connectionResolver';
import {
  sendCardsMessage,
  sendCoreMessage,
  sendNotificationsMessage
} from '../messageBroker';
import { validateRequest } from '../common/utils';
import { serviceDiscovery } from '../configs';
import { IUserDocument } from '@erxes/api-utils/src/types';
import { doAction } from '../utils';

export interface IRequestsModel extends Model<IGrantRequestDocument> {
  getGrantRequest(args: any): Promise<IGrantRequestDocument>;
  getGrantActions(): Promise<{ label: string; action: string }>;
  addGrantRequest(
    doc: any,
    user: IUserDocument
  ): Promise<IGrantRequestDocument>;
  editGrantRequest(doc: any): Promise<IGrantRequestDocument>;
  cancelGrantRequest(
    cardId: string,
    cardType: string
  ): Promise<IGrantRequestDocument>;
  resolveRequest(requestId: string): Promise<IGrantRequestDocument>;
}

export const loadRequestsClass = (models: IModels, subdomain: string) => {
  class Request {
    public static async getGrantRequest(args: any) {
      const { cardId, cardType } = args;

      if (!cardId || !cardType) {
        throw new Error('You must specify a card type and a card id');
      }

      const [requestId] = await sendCoreMessage({
        subdomain,
        action: 'conformities.savedConformity',
        data: {
          mainTypeId: cardId,
          mainType: cardType,
          relTypes: ['grantRequest']
        },
        isRPC: true,
        defaultValue: []
      });

      if (!requestId) {
        throw new Error('There has no  grant request in this card');
      }

      return await models.Requests.findOne({ _id: requestId });
    }

    public static async addGrantRequest(doc: any, user: IUserDocument) {
      const { cardId, cardType, userIds, action, params } = doc;
      try {
        await validateRequest(doc);
      } catch (e) {
        throw new Error(e.message);
      }

      const request = await models.Requests.create({
        userIds,
        action,
        params,
        requesterId: user._id
      });

      await sendCoreMessage({
        subdomain,
        action: 'conformities.addConformity',
        data: {
          mainType: cardType,
          mainTypeId: cardId,
          relType: 'grantRequest',
          relTypeId: request._id
        }
      });

      const link = await sendCardsMessage({
        subdomain,
        action: 'getLink',
        data: { _id: cardId, type: cardType },
        isRPC: true,
        defaultValue: null
      });

      if (!!link) {
        await sendNotificationsMessage({
          subdomain,
          action: 'send',
          data: {
            createdUser: user,
            receivers: userIds,
            title: `seeking grant`,
            action: 'wants grant',
            content: action,
            notifType: 'plugin',
            link: link
          }
        });
      }

      return request;
    }

    public static async editGrantRequest(doc) {
      const { cardId, cardType, userIds, action, params, requesterId } = doc;
      try {
        await validateRequest(doc);
      } catch (e) {
        throw new Error(e.message);
      }

      const request = await models.Requests.getGrantRequest({
        cardId,
        cardType
      });

      return await models.Requests.updateOne(
        { _id: request._id },
        { $set: { userIds, action, params, requesterId } }
      );
    }

    public static async resolveRequest(requestId) {
      const request = await models.Requests.findOne({ _id: requestId });

      if (!request) {
        return 'Something went wrong';
      }

      const declinedCount = await models.Responses.countDocuments({
        requestId: request._id,
        response: 'declined'
      });

      const requester = await sendCoreMessage({
        subdomain,
        action: 'users.findOne',
        data: {
          _id: request.requesterId
        },
        isRPC: true,
        defaultValue: null
      });

      if (!declinedCount) {
        await doAction(
          subdomain,
          await models.Requests.getGrantActions(),
          request.action,
          request.params,
          requester
        );

        await models.Requests.updateOne(
          { _id: request._id },
          { status: 'approved' }
        );
        return 'Your grant was successfully ';
      } else {
        await models.Requests.updateOne(
          { _id: request._id },
          { status: 'declined' }
        );
      }
    }

    public static async cancelGrantRequest(cardId: string, cardType: string) {
      const request = await models.Requests.getGrantRequest({
        cardId,
        cardType
      });

      if (!request) {
        throw new Error('Cannot find request');
      }

      if (request.status !== 'waiting') {
        throw new Error(
          'Cannot cancel request because request is already gotten respond'
        );
      }

      await sendCoreMessage({
        subdomain,
        action: 'conformities.removeConformity',
        data: {
          mainType: cardType,
          mainTypeId: cardId
        },
        isRPC: true
      });

      await models.Responses.deleteMany({ requestId: request._id });

      request.remove();
      return 'canceled';
    }

    public static async getGrantActions() {
      const services = await serviceDiscovery.getServices();
      const grantActions: {
        label: string;
        action: string;
        scope: string;
        type: string;
      }[] = [];

      for (const serviceName of services) {
        const service = await serviceDiscovery.getService(serviceName, true);
        const meta = service.config.meta || {};
        if (meta && meta.grants) {
          const actions = meta.grants?.actions || [];

          for (const { label, action, type } of actions) {
            grantActions.push({
              scope: serviceName,
              label: label,
              action,
              type
            });
          }
        }
      }

      return grantActions;
    }
  }

  grantSchema.loadClass(Request);

  return grantSchema;
};
