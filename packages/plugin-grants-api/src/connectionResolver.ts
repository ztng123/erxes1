import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import * as mongoose from 'mongoose';
import { IRequestsModel, loadRequestsClass } from './models/Request';
import { IResponsesModel, loadResponsesClass } from './models/Response';
import {
  IGrantRequestDocument,
  IGrantResponseDocument
} from './models/definitions/grant';

export interface IModels {
  Requests: IRequestsModel;
  Responses: IResponsesModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string
): IModels => {
  models = {} as IModels;

  models.Requests = db.model<IGrantRequestDocument, IRequestsModel>(
    'grant_requests',
    loadRequestsClass(models, subdomain)
  );
  models.Responses = db.model<IGrantResponseDocument, IResponsesModel>(
    'grant_responses',
    loadResponsesClass(models, subdomain)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
