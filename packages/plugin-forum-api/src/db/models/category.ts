import { Document, Schema, Model, Connection, Types } from 'mongoose';
import { Transform } from 'stream';
import { IModels } from './index';
import * as _ from 'lodash';

export interface ICategory {
  _id: any;
  name: string;
  code?: string | null;
  thumbnail?: string | null;
  parentId?: string | null;
}

export type InputCategoryInsert = Omit<ICategory, '_id'>;
export type InputCategoryPatch = Partial<Omit<ICategory, '_id'>>;

export type CategoryDocument = ICategory & Document;
export interface ICategoryModel extends Model<CategoryDocument> {
  findByIdOrThrow(_id: string): Promise<CategoryDocument>;
  forceDeleteCategory(_id: string): Promise<CategoryDocument>;
  createCategory(input: InputCategoryInsert): Promise<CategoryDocument>;
  patchCategory(
    _id: string,
    input: InputCategoryPatch
  ): Promise<CategoryDocument>;
  deleteCategory(
    _id: string,
    adopterCategoryId: string | null
  ): Promise<CategoryDocument>;
  getDescendantsOf(_id: string[]): Promise<ICategory[]>;
  getAncestorsOf(_id: string): Promise<ICategory[]>;
  isDescendantRelationship(
    ancestorId: string,
    descendantId: string
  ): Promise<boolean>;
}

// true, unique: true, sparse: true,

export const categorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  code: {
    type: String,
    index: true,
    unique: true,
    sparse: true,
    partialFilterExpression: { code: { $ne: null } }
  },
  thumbnail: String,
  parentId: { type: Types.ObjectId, index: true }
});

export const generateCategoryModel = (
  subdomain: string,
  con: Connection,
  models: IModels
): void => {
  class CategoryModel {
    public static async findByIdOrThrow(
      _id: string
    ): Promise<CategoryDocument> {
      const cat = await models.Category.findById(_id);
      if (!cat) {
        throw new Error(`Category with \`{ "_id" : "${_id}" doesn't exist.}\``);
      }
      return cat;
    }
    public static async createCategory(
      input: InputCategoryInsert
    ): Promise<CategoryDocument> {
      return await models.Category.create(input);
    }
    public static async patchCategory(
      _id: string,
      input: InputCategoryPatch
    ): Promise<CategoryDocument> {
      const patch = { ...input } as Partial<Omit<ICategory, '_id'>>;

      if (patch.parentId) {
        if (
          await models.Category.isDescendantRelationship(_id, patch.parentId)
        ) {
          throw new Error(
            `A category cannot be a subcategory of one of its own descendants`
          );
        }
      }

      await models.Category.updateOne({ _id }, patch);

      return models.Category.findByIdOrThrow(_id);
    }

    public static async deleteCategory(
      _id: string,
      adopterCategoryId: string | null = null
    ): Promise<CategoryDocument> {
      const cat = await models.Category.findByIdOrThrow(_id);

      const session = await con.startSession();
      session.startTransaction();

      try {
        const postsCount = await models.Post.countDocuments({
          categoryId: _id
        });

        if (postsCount > 0 && !adopterCategoryId) {
          throw new Error(
            `Cannot delete a category that has existing posts without specifying a different category to transfer its existing posts`
          );
        }

        await models.Post.updateMany(
          { categoryId: _id },
          { categoryId: adopterCategoryId }
        );
        await models.Category.updateMany(
          { parentId: _id },
          { parentId: adopterCategoryId }
        );
        await models.Category.deleteOne({ _id });
      } catch (e) {
        await session.abortTransaction();
        throw e;
      }

      await session.commitTransaction();
      return cat;
    }

    public static async forceDeleteCategory(
      _id: string
    ): Promise<CategoryDocument> {
      const cat = await models.Category.findByIdOrThrow(_id);

      const session = await con.startSession();
      session.startTransaction();

      try {
        const allCatIdsToDelete = (
          await models.Category.getDescendantsOf([_id])
        ).map(d => d._id);
        allCatIdsToDelete.push(cat._id);

        const postIdsToDelete = (
          await models.Post.find({
            categoryId: { $in: allCatIdsToDelete }
          }).select({ _id: 1 })
        ).map(p => p._id);
        const commentsToDelete = (
          await models.Comment.find({
            postId: { $in: postIdsToDelete }
          }).select({ _id: 1 })
        ).map(c => c._id);

        await models.Comment.deleteMany({ _id: { $in: commentsToDelete } });
        await models.Post.deleteMany({ _id: { $in: postIdsToDelete } });
        await models.Category.deleteMany({ _id: { $in: allCatIdsToDelete } });
      } catch (e) {
        await session.abortTransaction();
        throw e;
      }

      await session.commitTransaction();

      return cat;
    }

    public static async getDescendantsOf(_ids: string[]): Promise<ICategory[]> {
      const descendantsArrayName = 'descendants';

      const matchedCategories = await models.Category.aggregate([
        {
          $match: {
            _id: { $in: (_ids || []).map(v => Types.ObjectId(v)) }
          }
        },
        {
          $graphLookup: {
            from: models.Category.collection.collectionName,
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'parentId',
            as: descendantsArrayName
          }
        }
      ]);

      if (!matchedCategories?.length) {
        throw new Error(
          `Category with _id=${JSON.stringify(_ids)} doesn't exist`
        );
      }

      return (
        _.flatten(matchedCategories.map(x => x[descendantsArrayName])) || []
      );
    }

    public static async getAncestorsOf(_id: string): Promise<ICategory[]> {
      const ancestorsArrayName = 'ancestors';

      const results = await models.Category.aggregate([
        {
          $match: {
            _id: Types.ObjectId(_id)
          }
        },
        {
          $graphLookup: {
            from: models.Category.collection.collectionName,
            startWith: '$parentId',
            connectFromField: 'parentId',
            connectToField: '_id',
            as: ancestorsArrayName
          }
        }
      ]);

      if (!results?.length) {
        throw new Error(`Category with _id=${_id} doesn't exist`);
      }

      // it should contain only 1 category, since we $match-ed using its _id
      return results[0][ancestorsArrayName] || [];
    }

    public static async isDescendantRelationship(
      ancestorId: string,
      descendantId: string
    ): Promise<boolean> {
      const ancestors = await models.Category.getAncestorsOf(descendantId);
      const isInAncestors = ancestors.some(
        a => a._id.toString() === ancestorId
      );
      return isInAncestors;
    }
  }
  categorySchema.loadClass(CategoryModel);

  models.Category = con.model<CategoryDocument, ICategoryModel>(
    'forum_categories',
    categorySchema
  );
};
