import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import {
  IConfigDocument,
  ITrainingModel,
  IConfigModel,
  loadConfigClass,
  ITrainingDocument,
  loadTrainingClass
} from './models';

export interface IModels {
  Configs: IConfigModel;
  Trainings: ITrainingModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (
  db: mongoose.Connection,
  _subdomain: string
): IModels => {
  models = {} as IModels;

  models.Configs = db.model<IConfigDocument, IConfigModel>(
    'zerocodeai_configs',
    loadConfigClass(models)
  );

  models.Trainings = db.model<ITrainingDocument, ITrainingModel>(
    'zerocodeai_trainings',
    loadTrainingClass(models)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
