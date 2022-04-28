import * as mongoose from 'mongoose';
import { mainDb } from './configs';
import {
  loadPosClass,
  loadProductGroupClass,
  IPosModel,
  IProductGroupModel,
  IPosOrderModel,
  loadPosOrderClass,
} from './models/Pos';
import { IPosDocument, IPosOrderDocument, IProductGroupDocument } from './models/definitions/pos';
import { IContext as IMainContext } from '@erxes/api-utils/src';

export interface IModels {
  Pos: IPosModel;
  ProductGroup: IProductGroupModel;
  PosOrders: IPosOrderModel
}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels;

export const generateModels = async (
  hostnameOrSubdomain: string
): Promise<IModels> => {
  if (models) {
    return models;
  }

  loadClasses(mainDb, hostnameOrSubdomain);

  return models;
};

export const loadClasses = (db: mongoose.Connection, subdomain: string): IModels => {
  models = {} as IModels;

  models.Pos = db.model<IPosDocument, IPosModel>('pos', loadPosClass(models, subdomain));
  models.ProductGroup = db.model<IProductGroupDocument, IProductGroupModel>(
    'productGroup',
    loadProductGroupClass(models, subdomain)
  );

  models.PosOrders = db.model<IPosOrderDocument, IPosOrderModel>('pos_orders', loadPosOrderClass(models, subdomain))
  return models;
};
