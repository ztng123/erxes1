import { Document, Schema } from 'mongoose';
import { PARTICIPATION_STATUSES } from '../../constants';
import { field, schemaHooksWrapper } from './utils';

export interface IParticipant {
  customerId: string;
  dealId: string;
  status?: string;
  detail?: any;
}

export interface IParticipantDocument extends IParticipant, Document {
  _id: string;
  createdAt: Date;
}

export const participantSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    customerId: field({ type: String, label: 'Customer Id' }),
    dealId: field({ type: String, label: 'Deal Id' }),
    status: field({
      type: String,
      label: 'Status',
      enum: PARTICIPATION_STATUSES.ALL,
      default: 'participating',
      required: true
    }),
    detail: field({ type: Schema.Types.Mixed, label: 'Detail' }),
    createdAt: field({ type: Date, label: 'Created at' }),
  }),
  'erxes_participants'
);

// for tags query. increases search speed, avoids in-memory sorting
participantSchema.index({ customerId: 1, dealId: 1 });
