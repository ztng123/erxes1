import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { generateModels } from './connectionResolver';

import { initBroker } from './messageBroker';
import { initBrokerErkhet } from './messageBrokerErkhet';
import { initMemoryStorage } from './inmemoryStorage';
import afterMutations from './afterMutations';
import { getSubdomain } from '@erxes/api-utils/src/core';
import * as permissions from './permissions';

export let debug;
export let graphqlPubsub;
export let mainDb;
export let serviceDiscovery;

export default {
  name: 'syncerkhet',
  permissions,
  graphql: async sd => {
    serviceDiscovery = sd;
    return {
      typeDefs: await typeDefs(sd),
      resolvers: await resolvers(sd)
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

    await initBroker(options.messageBrokerClient);
    await initBrokerErkhet();

    initMemoryStorage();

    debug = options.debug;
    graphqlPubsub = options.pubsubClient;
  },
  meta: {
    afterMutations
  }
};
