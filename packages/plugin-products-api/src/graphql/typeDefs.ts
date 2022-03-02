import { gql } from 'apollo-server-express';

import {
  types as types,
  queries as queries,
  mutations as mutations
} from './schema/product';

const typeDefs = async (serviceDiscovery) => {
  const tagsAvailable = await serviceDiscovery.isEnabled('tags');
  const contactsAvailable = await serviceDiscovery.isEnabled('contacts');

  return gql`
    scalar JSON
    scalar Date
    
    ${types(tagsAvailable, contactsAvailable)}
    
    extend type Query {
      ${queries}
    }
    
    extend type Mutation {
      ${mutations}
    }
  `;
};

export default typeDefs;