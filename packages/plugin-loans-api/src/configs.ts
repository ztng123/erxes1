import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { generateModels } from './connectionResolver';
import { initBroker } from './messageBroker';
import documents from './documents';
import forms from './forms';
import imports from './imports';
import exporter from './exporter';
import logs from './logUtils';
import * as permissions from './permissions';
import payment from './payment';
import { checkContractScheduleAnd } from './cronjobs/contractCronJobs';
import { getSubdomain } from '@erxes/api-utils/src/core';

export let debug;
export let graphqlPubsub;
export let mainDb;
export let serviceDiscovery;

export default {
  name: 'loans',
  permissions,
  graphql: async sd => {
    serviceDiscovery = sd;

    return {
      typeDefs: await typeDefs(),
      resolvers: await resolvers()
    };
  },

  apolloServerContext: async (context, req) => {
    const subdomain = getSubdomain(req);

    context.subdomain = subdomain;
    context.models = await generateModels(subdomain);

    return context;
  },

  onServerInit: async options => {
    mainDb = options.db;

    initBroker(options.messageBrokerClient);

    debug = options.debug;
    graphqlPubsub = options.pubsubClient;
  },
  meta: {
    logs: { consumers: logs },
    cronjobs: {
      handleDailyJob: checkContractScheduleAnd
    },
    documents,
    forms,
    imports,
    exporter,
    payment
  }
};
