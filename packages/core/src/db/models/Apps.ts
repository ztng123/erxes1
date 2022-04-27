import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import { IModels } from '../../connectionResolver';
import { appSchema, IAppDocument, IApp } from './definitions/apps';

dotenv.config();

const { JWT_TOKEN_SECRET = '' } = process.env;

export interface IAppModel extends Model<IAppDocument> {
  getApp(_id: string): Promise<IAppDocument>;
  createApp(doc: IApp): Promise<IAppDocument>;
  updateApp(_id: string, doc: IApp): Promise<IAppDocument>;
  removeApp(_id: string): Promise<any>;
}

export const loadAppClass = (models: IModels) => {
  class App {
    public static async getApp(_id: string) {
      const app = await models.Apps.findOne({ _id });

      if (!app) {
        throw new Error('App not found');
      }

      return app;
    }

    public static async createApp(doc: IApp) {
      const app = await models.Apps.create(doc);

      const accessToken = await jwt.sign({ app }, JWT_TOKEN_SECRET, { expiresIn: '14d' });
      const refreshToken = await jwt.sign({ app }, JWT_TOKEN_SECRET, { expiresIn: '30d' });

      await models.Apps.updateOne(
        { _id: app._id },
        { $set: { accessToken, refreshToken } }
      );

      return models.Apps.findOne({ _id: app._id });
    }

    public static async updateApp(_id: string, doc: IApp) {
      const app = await models.Apps.getApp(_id);

      await models.Apps.updateOne({ _id }, { $set: doc });

      return models.Apps.findOne({ _id: app._id });
    }

    public static async removeApp(_id: string) {
      const app = await models.Apps.getApp(_id);

      if (app.isEnabled) {
        throw new Error('Can not remove an enabled app');
      }

      return models.Apps.deleteOne({ _id });
    }
  }

  appSchema.loadClass(App);

  return appSchema;
}
