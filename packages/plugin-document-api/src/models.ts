import * as _ from 'underscore';
import { model } from 'mongoose';
import { Schema } from 'mongoose';

export const typeSchema = new Schema({
  name: String
});

export const documentSchema = new Schema({
  name: String,
  createdAt: Date,
  expiryDate: Date,
  checked: Boolean,
  typeId: String
});

export const loadTypeClass = () => {
  class Type {
    public static async getType(_id: string) {
      const type = await Types.findOne({ _id });

      if (!type) {
        throw new Error('Type not found');
      }

      return type;
    }
    // create type
    public static async createType(doc) {
      return Types.create({ ...doc });
    }
    // remove type
    public static async removeType(_id: string) {
      return Types.deleteOne({ _id });
    }

    public static async updateType(_id: string, doc) {
      return Types.updateOne({ _id }, { $set: { ...doc } });
    }
  }

  typeSchema.loadClass(Type);
  return typeSchema;
};

export const loadDocumentClass = () => {
  class Document {
    public static async getDocument(_id: string) {
      const document = await Documents.findOne({ _id });

      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    }

    // create
    public static async createDocument(doc) {
      return Documents.create({
        ...doc,
        createdAt: new Date()
      });
    }
    // update
    public static async updateDocument (_id: string, doc) {
      await Documents.updateOne(
        { _id },
        { $set: { ...doc } }
      ).then(err => console.error(err));
    }
    // remove
    public static async removeDocument(_id: string) {
      return Documents.deleteOne({ _id });
    }
  }

documentSchema.loadClass(Document);

return documentSchema;
};

loadDocumentClass();
loadTypeClass();

// tslint:disable-next-line
export const Types = model<any, any>(
  'document_types',
  typeSchema
);

// tslint:disable-next-line
export const Documents = model<any, any>('documents', documentSchema);
