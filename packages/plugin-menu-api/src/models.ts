import * as _ from 'underscore';
import { model } from 'mongoose';
import { Schema } from 'mongoose';

export const typeSchema = new Schema({
  name: String
});

export const menuSchema = new Schema({
  name: String,
  createdAt: Date,
  expiryDate: Date,
  checked: Boolean,
  typeId: String,
  title: String,
  content: String,
  images: [String],
  tables: [Schema.Types.Mixed],
  links: [String]
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

export const loadMenuClass = () => {
  class Menu {
    public static async getMenu(_id: string) {
      const menu = await Menus.findOne({ _id });

      if (!menu) {
        throw new Error('Menu not found');
      }

      return menu;
    }

    // create
    public static async createMenu(doc) {
      return Menus.create({
        ...doc,
        createdAt: new Date(),
        checked: doc.checked || false,
        images: doc.images || [],
        tables: doc.tables || [],
        links: doc.links || []
      });
    }
    // update
    public static async updateMenu(_id: string, doc) {
      await Menus.updateOne({ _id }, { $set: { ...doc } }).then(err =>
        console.error(err)
      );
    }
    // remove
    public static async removeMenu(_id: string) {
      return Menus.deleteOne({ _id });
    }
  }

  menuSchema.loadClass(Menu);

  return menuSchema;
};

loadMenuClass();
loadTypeClass();

// tslint:disable-next-line
export const Types = model<any, any>('menu_types', typeSchema);

// tslint:disable-next-line
export const Menus = model<any, any>('menus', menuSchema);
