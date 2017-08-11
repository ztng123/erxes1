import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Match, check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Channels } from '/imports/api/channels/channels';
import { Integrations } from '/imports/api/integrations/integrations';
import { Brands } from '../brands';

Meteor.publish('brands.list', function brandsList(limit) {
  check(limit, Match.Optional(Number));

  if (!this.userId) {
    return this.ready();
  }

  Counts.publish(this, 'brands.list.count', Brands.find(), { noReady: true });

  return Brands.find(
    {},
    {
      fields: Brands.publicFields,
      sort: { createdAt: -1 },
      limit: limit || 100,
    },
  );
});

// return only available channels's related brands
Meteor.publish('brands.list.inChannels', function brandsListInChannels() {
  if (!this.userId) {
    return this.ready();
  }

  // available channels
  const channels = Channels.find({
    memberIds: { $in: [this.userId] },
  });

  // all available integration ids
  let integrationIds = [];

  channels.forEach(channel => {
    integrationIds = _.union(integrationIds, channel.integrationIds || []);
  });

  // find all possible brand ids
  const brandIds = [];

  Integrations.find({ _id: { $in: integrationIds } }).forEach(integration => {
    brandIds.push(integration.brandId);
  });

  return Brands.find({ _id: { $in: brandIds } }, { fields: Brands.publicFields });
});

Meteor.publish('brands.getById', function brandsGetById(id) {
  check(id, String);

  if (!this.userId) {
    return this.ready();
  }

  return Brands.find({ _id: id }, { fields: Brands.publicFields });
});
