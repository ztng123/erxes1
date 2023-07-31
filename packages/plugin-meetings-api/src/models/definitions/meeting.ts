import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface IMeeting {
  _id: string;
  title: string;
  description: string;

  startDate: Date;
  endDate: Date;
  location: string;

  createdBy: string;
  updatedBy: string;

  createdAt: Date;

  status: string;

  companyId: string;

  participantIds: string[];
}

export interface IMeetingDocument extends IMeeting, Document {
  _id: string;
}

export const meetingSchema = new Schema({
  _id: field({ pkey: true }),
  title: field({ type: String }),
  description: field({ type: String }),

  startDate: field({ type: Date }),
  endDate: field({ type: Date }),
  location: field({ type: String }),

  createdBy: field({ type: String }),
  updatedBy: field({ type: String }),
  createdAt: field({
    type: Date,
    default: Date.now,
    label: 'Registered at'
  }),
  companyId: field({ type: String }),

  status: field({
    type: String,
    enum: ['scheduled', 'completed', 'canceled'],
    default: 'scheduled'
  }),

  participantIds: field({ type: [String], optional: true })
});
