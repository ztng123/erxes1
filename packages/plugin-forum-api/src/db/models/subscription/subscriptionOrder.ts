import { Document, Schema, Model, Connection, Types } from 'mongoose';
import { IModels } from '../index';
import * as _ from 'lodash';
import { TimeDurationUnit, TIME_DURATION_UNITS } from '../../../consts';
import { ICpUser } from '../../../graphql';
import { LoginRequiredError } from '../../../customErrors';

export interface ISubscriptionOrder {
  _id: any;

  invoiceId?: string | null;
  invoiceAt?: Date | null;

  paymentConfirmed?: boolean | null;
  paymentConfirmedAt?: Date | null;

  unit: TimeDurationUnit;
  multiplier: number;

  price: number;

  cpUserId: string;
  createdAt: Date;
}

export type SubscriptionOrderDocument = ISubscriptionOrder & Document;

export interface ISubscriptionOrderModel
  extends Model<SubscriptionOrderDocument> {
  findByIdOrThrow(_id: string): Promise<SubscriptionOrderDocument>;

  cpFindByIdOwnOrThrow(
    _id: string,
    user?: ICpUser | null
  ): Promise<SubscriptionOrderDocument>;
  cpMyOrders(user?: ICpUser | null): Promise<SubscriptionOrderDocument[]>;
  cpCreateSubscriptionOrder(
    subscriptionProductId: string,
    user?: ICpUser | null
  ): Promise<SubscriptionOrderDocument>;
}

export const subscriptionOrderSchema = new Schema<SubscriptionOrderDocument>({
  invoiceId: String,
  invoiceAt: Date,

  paymentConfirmed: Boolean,
  paymentConfirmedAt: Date,

  unit: {
    type: String,
    required: true,
    enum: TIME_DURATION_UNITS
  },

  multiplier: {
    type: Number,
    required: true,
    min: 0
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  cpUserId: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    required: true,
    default: () => new Date()
  }
});

export const generateSubscriptionOrderModel = (
  subdomain: string,
  con: Connection,
  models: IModels
): void => {
  class SubscriptionOrderModel {
    public static async findByIdOrThrow(
      _id: string
    ): Promise<SubscriptionOrderDocument> {
      const doc = await models.SubscriptionOrder.findById(_id);
      if (!doc) {
        throw new Error('Subscription order not found');
      }
      return doc;
    }

    public static async cpFindByIdOwnOrThrow(
      _id: string,
      user?: ICpUser | null
    ): Promise<SubscriptionOrderDocument> {
      if (!user) throw new LoginRequiredError();

      const doc = await models.SubscriptionOrder.findByIdOrThrow(_id);
      if (doc.cpUserId !== user.userId)
        throw new Error('Subscription order not found');

      return doc;
    }

    public static async cpMyOrders(
      user?: ICpUser | null
    ): Promise<SubscriptionOrderDocument[]> {
      if (!user) throw new LoginRequiredError();

      const docs = await models.SubscriptionOrder.find({
        cpUserId: user.userId
      });

      return docs;
    }

    public static async cpCreateSubscriptionOrder(
      subscriptionProductId: string,
      user?: ICpUser | null
    ): Promise<SubscriptionOrderDocument> {
      if (!user) throw new LoginRequiredError();

      const product = await models.SubscriptionProduct.findByIdOrThrow(
        subscriptionProductId
      );

      const doc = await models.SubscriptionOrder.create({
        unit: product.unit,
        multiplier: product.multiplier,
        price: product.price,
        cpUserId: user.userId
      });

      return doc;
    }
  }
  subscriptionOrderSchema.loadClass(SubscriptionOrderModel);

  models.SubscriptionOrder = con.model<
    SubscriptionOrderDocument,
    ISubscriptionOrderModel
  >('forum_subscription_orders', subscriptionOrderSchema);
};
