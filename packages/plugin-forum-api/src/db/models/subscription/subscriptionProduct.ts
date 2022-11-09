import { Document, Schema, Model, Connection, Types } from 'mongoose';
import { IModels } from '../index';
import * as _ from 'lodash';
import { TimeDurationUnit, TIME_DURATION_UNITS } from '../../../consts';

export interface ISubscriptionProduct {
  _id: any;
  name?: string | null;
  description?: string | null;
  unit: TimeDurationUnit;
  multiplier: number;
  price: number;
}

export type SubscriptionProductInsert = Omit<ISubscriptionProduct, '_id'>;
export type SubscriptionProductPatch = Partial<SubscriptionProductInsert>;

export type SubscriptionProductDocument = ISubscriptionProduct & Document;

export interface ISubscriptionProductModel
  extends Model<SubscriptionProductDocument> {
  findByIdOrThrow(_id: string): Promise<SubscriptionProductDocument>;

  createSubscriptionProduct(
    input: SubscriptionProductInsert
  ): Promise<SubscriptionProductDocument>;
  patchSubscriptionProduct(
    _id: string,
    input: SubscriptionProductPatch
  ): Promise<SubscriptionProductDocument>;

  deleteSubscriptionProduct(_id: string): Promise<SubscriptionProductDocument>;
}

export const subscriptionProductSchema = new Schema<
  SubscriptionProductDocument
>({
  name: String,
  description: String,
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
  }
});

export const generateSubscriptionProductModel = (
  subdomain: string,
  con: Connection,
  models: IModels
): void => {
  const { SubscriptionProduct } = models;

  class SubscriptionProductModel {
    public static async findByIdOrThrow(
      _id: string
    ): Promise<SubscriptionProductDocument> {
      const product = await SubscriptionProduct.findById(_id);
      if (!product) {
        throw new Error('Subscription product not found');
      }
      return product;
    }

    public static async createSubscriptionProduct(
      input: SubscriptionProductInsert
    ): Promise<SubscriptionProductDocument> {
      const product = await SubscriptionProduct.create(input);
      return product;
    }

    public static async patchSubscriptionProduct(
      _id: string,
      input: SubscriptionProductPatch
    ): Promise<SubscriptionProductDocument> {
      const product = await SubscriptionProduct.findByIdOrThrow(_id);
      _.assign(product, input);
      await product.save();
      return product;
    }

    public static async deleteSubscriptionProduct(
      _id: string
    ): Promise<SubscriptionProductDocument> {
      const product = await SubscriptionProduct.findByIdOrThrow(_id);
      await product.remove();
      return product;
    }
  }
  subscriptionProductSchema.loadClass(SubscriptionProductModel);

  models.SubscriptionProduct = con.model<
    SubscriptionProductDocument,
    ISubscriptionProductModel
  >('forum_subscription_products', subscriptionProductSchema);
};
