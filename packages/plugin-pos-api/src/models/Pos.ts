import {
  posSchema,
  productGroupSchema,
  IPosDocument,
  IProductGroupDocument,
  IPosOrderDocument,
  posOrderSchema
} from './definitions/pos';
import { IPOS } from '../types';
import { Model } from 'mongoose';
import { IModels } from '../connectionResolver';

export interface IPosModel extends Model<IPosDocument> {
  getPosList(query: any): IPosDocument;
  getPos(query: any): IPosDocument;
  posAdd(user, doc: IPOS): IPosDocument;
  posEdit(_id: string, doc: IPOS): IPosDocument;
  posRemove(_id: string): IPosDocument;
}

export const loadPosClass = (models: IModels, _subdomain) => {
  class Pos {
    public static async getPosList(query: any) {
      return models.Pos.find(query).sort({ createdAt: 1 });
    }

    public static async getPos(query: any) {
      const pos = await models.Pos.findOne(query).lean();

      if (!pos) {
        throw new Error('POS not found');
      }
      return pos;
    }

    public static generateToken(length: number = 32) {
      const a = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split(
        ''
      );
      const b = [] as any;

      for (let i = 0; i < length; i++) {
        const j = (Math.random() * (a.length - 1)).toFixed(0);

        b[i] = a[j];
      }

      return b.join('');
    }

    public static async posAdd(user, doc: IPOS) {
      try {
        return models.Pos.create({
          ...doc,
          userId: user._id,
          createdAt: new Date(),
          token: this.generateToken()
        });
      } catch (e) {
        throw new Error(
          `Can not create POS integration. Error message: ${e.message}`
        );
      }
    }

    public static async posEdit(_id: string, doc: IPOS) {
      await models.Pos.getPos({ _id });

      await models.Pos.updateOne(
        { _id },
        { $set: { ...doc } },
        { runValidators: true }
      );

      return models.Pos.findOne({ _id }).lean();
    }

    public static async posRemove(_id: string) {
      const pos = await models.Pos.getPos({ _id });

      await models.ProductGroups.remove({ posId: pos._id });

      return models.Pos.deleteOne({ _id });
    }
  }

  posSchema.loadClass(Pos);

  return posSchema;
};

export interface IProductGroupModel extends Model<IProductGroupDocument> {
  groups(posId: string): IProductGroupDocument[];
  groupsAdd(user, name, description): IProductGroupDocument;
  groupsEdit(_id, doc): IProductGroupDocument;
  groupsRemove(_id: string): IProductGroupDocument;
}

export const loadProductGroupClass = (models, _subdomain) => {
  class ProductGroup {
    public static async groups(posId: string) {
      return models.ProductGroups.find({ posId }).lean();
    }

    public static async groupsAdd(user, name, description) {
      return models.ProductGroups.create({
        userId: user._id,
        name,
        description,
        createdAt: new Date()
      });
    }

    public static async groupsEdit(_id, doc) {
      const group = await models.ProductGroups.findOne({ _id }).lean();

      if (!group) {
        throw new Error('group not found');
      }

      await models.ProductGroups.updateOne(
        { _id },
        {
          $set: { ...doc }
        }
      );

      return await models.ProductGroups.findOne({ _id }).lean();
    }

    public static async groupsRemove(_id: string) {
      return models.ProductGroups.deleteOne({ _id });
    }
  }

  productGroupSchema.loadClass(ProductGroup);

  return productGroupSchema;
};

export interface IPosOrderModel extends Model<IPosOrderDocument> {}
export const loadPosOrderClass = (_models, _subdomain) => {
  class PosOrder {}

  posOrderSchema.loadClass(PosOrder);

  return posOrderSchema;
};
