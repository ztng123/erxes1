import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';
import { IJobRefer } from './jobs';

export interface IJob {
  id: string;
  nextJobIds: string[];
  type: string;
  config: {
    jobReferId?: string;
    productId?: string;
    inBranchId: string;
    outBranchId: string;
    inDepartmentId: string;
    outDepartmentId: string;
    durationType: string;
    duration: number;
    // quantity: number;
  };
  style: object;
  label: string;
  description: string;
}

export interface IJobDocument extends IJob {
  jobRefer: IJobRefer;
}

export interface IFlow {
  name: string;
  categoryId?: string;
  productId?: string;
  status: string;
  flowValidation: string;
  jobs?: IJobDocument[];
}

export interface IFlowDocument extends IFlow, Document {
  _id: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export const jobSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    nextJobIds: { type: [String] },
    config: { type: Object },
    style: { type: Object },
    icon: { type: String, optional: true },
    label: { type: String, optional: true },
    description: { type: String, optional: true }
  },
  { _id: false }
);

export const flowSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: { type: String, required: true },
    categoryId: field({
      type: String,
      label: 'Category',
      optional: true,
      index: true
    }),
    productId: field({
      type: String,
      label: 'Product',
      optional: true,
      index: true
    }),
    status: field({ type: String, label: 'Status' }),
    flowValidation: field({ type: String, label: 'FlowJob status' }),
    createdAt: { type: Date, default: new Date(), label: 'Created date' },
    createdBy: { type: String },
    updatedAt: { type: Date, default: new Date(), label: 'Updated date' },
    updatedBy: { type: String },
    jobs: field({ type: [jobSchema], optional: true, label: 'Jobs' }),
    latestBranchId: { type: String },
    latestDepartmentId: { type: String }
  }),
  'erxes_flows'
);

// for tags query. increases search speed, avoids in-memory sorting
flowSchema.index({ status: 1 });
