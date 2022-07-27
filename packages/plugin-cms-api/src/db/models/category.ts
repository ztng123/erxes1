import { Document, Schema, Model, Connection, Types } from 'mongoose';
import { IModels } from './index';

export interface ICategory {
  name: string;
  parentCategoryId?: string | null;
  topicId?: string | null;
}

export interface ICategoryDocument extends Document, ICategory {}

export interface ICategoryModel extends Model<ICategoryDocument> {
  getDescendantsOf(_id: string): Promise<ICategory[]>;
  getAncestorsOf(_id: string): Promise<ICategory[]>;
}

export const categorySchema = new Schema<ICategoryDocument>({
  name: { type: String, required: true },
  parentCategoryId: { type: String },
  topicId: { type: String }
});

export const generateCategoryModel = (
  subdomain: string,
  con: Connection,
  models: IModels
): void => {
  class CategoryModel implements ICategory {
    public name: string;

    async getDescendantsOf(
      _id: string
    ): Promise<ICategory[] | undefined | null> {
      const matchedCategories = await models.Category.aggregate([
        {
          $match: {
            _id
          },
          $graphLookup: {
            from: models.Category.collection.collectionName,
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'parentId',
            as: 'descendants'
          }
        }
      ]);

      if (!matchedCategories?.length) {
        throw new Error(`Category with _id=${_id} doesn't exist`);
      }

      // it should contain only 1 root category, since we $match-ed using its _id
      return matchedCategories[0].descendants;
    }

    async getAncestorsOf(_id: string): Promise<ICategory[] | undefined | null> {
      const results = await models.Category.aggregate([
        {
          $match: {
            _id
          },
          $graphLookup: {
            from: models.Category.collection.collectionName,
            startWith: '$parentId',
            connectFromField: 'parentId',
            connectToField: '_id',
            as: 'ancestors'
          }
        }
      ]);

      if (!results?.length) {
        throw new Error(`Category with _id=${_id} doesn't exist`);
      }

      // it should contain only 1 root category, since we $match-ed using its _id
      return results[0].ancestors;
    }
  }
  categorySchema.loadClass(CategoryModel);

  models.Category = con.model<ICategoryDocument, ICategoryModel>(
    'cms-categories',
    categorySchema
  );
};
