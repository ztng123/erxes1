import { Schema, Document } from 'mongoose';
import { field } from './utils';

export interface IGrantRequest {
  contentType: string;
  contentTypeId: string;
  scope: string;
  userIds: string[];
  action: string;
  params: string;
  requesterId: string;
  status: 'waiting' | 'approved' | 'declined';
}

export interface IGrantResponse {
  userId: string;
  response: 'approved' | 'declined';
  description: string;
}

export interface IGrantRequestDocument extends IGrantRequest, Document {
  _id: string;
}

export interface IGrantResponseDocument extends IGrantResponse, Document {
  _id: string;
}

export const grantSchema = new Schema({
  _id: field({ pkey: true }),
  contentTypeId: field({
    type: String,
    label: 'content type id'
  }),
  contentType: field({ type: String, label: 'content type' }),
  scope: field({ type: String, label: 'Service scope' }),
  requesterId: field({ type: String, label: 'Requester Id' }),
  userIds: field({ type: [String], label: 'Members seeking grant' }),
  action: field({ type: String, label: 'Grant action' }),
  params: field({ type: String, label: 'Grant params' }),
  status: field({
    type: String,
    label: 'request status',
    enum: ['waiting', 'approved', 'declined'],
    default: 'waiting'
  })
});

export const grantResponsesSchema = new Schema({
  _id: field({ pkey: true }),
  userId: field({ type: String, label: 'Response member id' }),
  requestId: field({ type: String, label: 'Request id' }),
  response: field({
    type: String,
    enum: ['approved', 'declined'],
    label: 'Grant status'
  }),
  description: field({
    type: String,
    label: 'Grant description',
    optional: true
  }),
  createdAt: field({ type: Date, label: 'Created at', default: Date.now })
});
