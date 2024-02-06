import * as _ from 'underscore';
import { model } from 'mongoose';
import { Schema } from 'mongoose';

export const typeSchema = new Schema({
  name: String
});

export const dashboardSchema = new Schema({
  name: String,
  createdAt: Date,
  expiryDate: Date,
  checked: Boolean,
  typeId: String
});

export const loadTypeClass = () => {
  class Type {
    public static async getType(_id: string) {
      const type = await Types.findOne({ _id });

      if (!type) {
        throw new Error('Type not found');
      }

      return type;
    }
    // create type
    public static async createType(doc) {
      return Types.create({ ...doc });
    }
    // remove type
    public static async removeType(_id: string) {
      return Types.deleteOne({ _id });
    }

    public static async updateType(_id: string, doc) {
      return Types.updateOne({ _id }, { $set: { ...doc } });
    }
  }

  typeSchema.loadClass(Type);
  return typeSchema;
};

export const loadDashboardClass = () => {
  class Dashboard {
    public static async getDashboard(_id: string) {
      const dashboard = await Dashboards.findOne({ _id });

      if (!dashboard) {
        throw new Error('Dashboard not found');
      }

      return dashboard;
    }

    // create
    public static async createDashboard(doc) {
      return Dashboards.create({
        ...doc,
        createdAt: new Date()
      });
    }
    // update
    public static async updateDashboard(_id: string, doc) {
      await Dashboards.updateOne({ _id }, { $set: { ...doc } }).then(err =>
        console.error(err)
      );
    }
    // remove
    public static async removeDashboard(_id: string) {
      return Dashboards.deleteOne({ _id });
    }
  }

  dashboardSchema.loadClass(Dashboard);

  return dashboardSchema;
};

loadDashboardClass();
loadTypeClass();

// tslint:disable-next-line
export const Types = model<any, any>('dashboard_types', typeSchema);

// tslint:disable-next-line
export const Dashboards = model<any, any>('dashboards', dashboardSchema);
