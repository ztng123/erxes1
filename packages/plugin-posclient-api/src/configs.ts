import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { generateModels } from './connectionResolver';
import { initBroker } from './messageBroker';
import { initMemoryStorage } from './inmemoryStorage';
import { getSubdomain } from '@erxes/api-utils/src/core';

export let debug;
export let graphqlPubsub;
export let mainDb;
export let serviceDiscovery;

export default {
  name: 'posclient',
  graphql: async sd => {
    console.log('sd================================>', sd);
    serviceDiscovery = sd;

    return {
      typeDefs: await typeDefs(sd),
      resolvers
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

    initBroker();

    initMemoryStorage();

    debug = options.debug;
    graphqlPubsub = options.pubsubClient;
  },
  meta: {}
};
