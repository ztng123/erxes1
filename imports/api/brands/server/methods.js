import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ErxesMixin } from '/imports/api/utils';
import { Brands, emailConfigSchema } from '../brands';

// brand add
export const add = new ValidatedMethod({
  name: 'brands.add',
  mixins: [ErxesMixin],

  validate({ doc }) {
    check(doc, Brands.schema);
  },

  run({ doc }) {
    const id = Brands.insert(Object.assign({ userId: this.userId }, doc));
    return id;
  },
});

// brand edit
export const edit = new ValidatedMethod({
  name: 'brands.edit',
  mixins: [ErxesMixin],

  validate({ id, doc }) {
    check(id, String);
    check(doc, Brands.schema);
  },

  run({ id, doc }) {
    const brand = Brands.findOne(id, {
      fields: {
        userId: 1,
      },
    });

    if (!brand) {
      throw new Meteor.Error('brands.edit.notFound', 'Brand not found');
    }

    return Brands.update(id, { $set: doc });
  },
});

// brand remove
export const remove = new ValidatedMethod({
  name: 'brands.remove',
  mixins: [ErxesMixin],

  validate(id) {
    check(id, String);
  },

  run(id) {
    const brand = Brands.findOne(id, { fields: { userId: 1 } });

    if (!brand) {
      throw new Meteor.Error('brands.remove.notFound', 'Brand not found');
    }

    return Brands.remove(id);
  },
});

// config email
export const configEmail = new ValidatedMethod({
  name: 'brands.configEmail',
  mixins: [ErxesMixin],

  validate({ id, config }) {
    check(id, String);
    check(config, emailConfigSchema);
  },

  run({ id, config }) {
    return Brands.update(id, { $set: { emailConfig: config } });
  },
});
