import { MongoClient } from 'mongodb';
import * as mongoose from 'mongoose';
import { mainDb } from './configs';
import {
  IDashboardDocument,
  IDashboardItemDocument
} from './models/definitions/dashboard';
import {
  IDashboardModel,
  IDashboardItemModel,
  loadDashboardClass,
  loadDashboardItemClass
} from './models/Dashboard';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import { userSchema } from '@erxes/api-utils/src/definitions/users';

export interface IModels {
  Dashboards: IDashboardModel;
  DashboardItems: IDashboardItemModel;
}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels;

export const generateModels = async (
  _hostnameOrSubdomain: string
): Promise<IModels> => {
  if (models) {
    return models;
  }

  loadClasses(mainDb);

  return models;
};

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.Dashboards = db.model<IDashboardDocument, IDashboardModel>(
    'dashboards',
    loadDashboardClass(models)
  );

  models.DashboardItems = db.model<IDashboardItemDocument, IDashboardItemModel>(
    'dashboard_items',
    loadDashboardItemClass(models)
  );

  return models;
};
