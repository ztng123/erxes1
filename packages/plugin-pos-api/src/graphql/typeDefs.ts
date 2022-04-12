import { gql } from 'apollo-server-express';

import {
  types as posTypes,
  queries as posQueries,
  mutations as posMutations,
} from './schema/pos';

const typeDefs = async (serviceDiscovery) => {
  return gql`
    scalar JSON
    scalar Date

    ${await posTypes(serviceDiscovery)}

    extend type Query {
      ${posQueries}
    }

    extend type Mutation {
      ${posMutations}
    }
  `;
};

export default typeDefs;
