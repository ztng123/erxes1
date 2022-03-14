import { MongoClient } from 'mongodb';
import * as mongoose from 'mongoose';

import { IContext as IMainContext } from '@erxes/api-utils/src';

import { mainDb } from './configs';
import {
  IActivityLogModel,
  IActivityLogDocument,
  loadClass as loadActivityLogClass,
} from './models/ActivityLogs';
import { ILogModel, ILogDocument, loadLogClass } from './models/Logs';
import { IVisitorModel, IVisitorDocument, loadVisitorClass } from './models/Visitors';

export interface ICoreIModels {
  Users;
}

export interface IModels {
  ActivityLogs: IActivityLogModel;
  Logs: ILogModel;
  Visitors: IVisitorModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
  coreModels: ICoreIModels;
}

export let models: IModels;
export let coreModels: ICoreIModels;

export const getSubdomain = (hostname: string): string => {
  return hostname.replace(/(^\w+:|^)\/\//, '').split('.')[0];
};

export const generateCoreModels = async (
  _hostnameOrSubdomain: string
): Promise<ICoreIModels> => {
  return coreModels;
};

export const generateModels = async (
  hostnameOrSubdomain: string
): Promise<IModels> => {
  if (models) {
    return models;
  }

  coreModels = await connectCore();

  loadClasses(mainDb, hostnameOrSubdomain);

  return models;
};

export const connectCore = async () => {
  if (coreModels) {
    return coreModels;
  }

  const url = process.env.API_MONGO_URL || 'mongodb://localhost/erxes';
  const client = new MongoClient(url);

  let db;

  await client.connect();

  console.log(`Connected successfully to ${url}`);

  db = client.db();

  coreModels = {
    Users: await db.collection('users'),
  };

  return coreModels;
};

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string
): IModels => {
  models = {} as IModels;

  models.ActivityLogs = db.model<IActivityLogDocument, IActivityLogModel>(
    'activity_logs',
    loadActivityLogClass(models, subdomain)
  );

  models.Logs = db.model<ILogDocument, ILogModel>(
    'logs',
    loadLogClass(models)
  );

  models.Visitors = db.model<IVisitorDocument, IVisitorModel>(
    'visitors',
    loadVisitorClass(models)
  );

  return models;
};
