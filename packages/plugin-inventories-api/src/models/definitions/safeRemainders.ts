import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

export interface ISafeRemainder {
  date: Date;
  description?: string;

  status: string;
  branchId: string;
  departmentId: string;
  productCategoryId: string;
  createdAt?: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
}

export interface ISafeRemainderDocument extends ISafeRemainder, Document {
  _id: string;
  createdAt: Date;
  createdBy: string;
  modifiedAt: Date;
  modifiedBy: string;
}

export const safeRemainderSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    date: field({ type: Date, label: 'Date' }),
    description: field({ type: String, label: 'Description' }),

    status: field({ type: String, label: 'Status' }),
    branchId: field({ type: String, default: '', label: 'Branch' }),
    departmentId: field({ type: String, default: '', label: 'Department' }),
    productCategoryId: field({ type: String, label: 'Product Category' }),

    createdAt: { type: Date, default: new Date(), label: 'Created date' },
    createdBy: { type: String, label: 'Created User' },
    modifiedAt: { type: Date, default: new Date(), label: 'Modified date' },
    modifiedBy: { type: String, label: 'Modified User' }
  }),
  'erxes_safe_remainders'
);
