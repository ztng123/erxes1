import { gql } from 'apollo-server-express';
import {
  types as tumentechTypes,
  queries as tumentechQueries,
  mutations as tumentechMutations
} from './schema/tumentech';
import {
  types as placeTypes,
  queries as placeQueries,
  mutations as placeMutations
} from './schema/places';
import {
  types as directionTypes,
  queries as directionQueries,
  mutations as directionMutations
} from './schema/directions';
import {
  types as routeTypes,
  queries as routeQueries,
  mutations as routeMutations
} from './schema/routes';

const typeDefs = async serviceDiscovery => {
  const isContactsEnabled = await serviceDiscovery.isEnabled('contacts');
  const cardsAvailable = await serviceDiscovery.isEnabled('cards');

  const isEnabled = {
    contacts: isContactsEnabled,
    cards: cardsAvailable
  };

  return gql`
    scalar JSON
    scalar Date

    enum CacheControlScope {
      PUBLIC
      PRIVATE
    }
    
    directive @cacheControl(
      maxAge: Int
      scope: CacheControlScope
      inheritMaxAge: Boolean
    ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
    
    ${tumentechTypes(isEnabled)}
    ${placeTypes}
    ${routeTypes}
    ${directionTypes}
    
    extend type Query {
      ${placeQueries}
      ${tumentechQueries}
      ${directionQueries}
      ${routeQueries}
    }
    
    extend type Mutation {
      ${placeMutations}
      ${tumentechMutations}
      ${directionMutations}
      ${routeMutations}
    }
  `;
};

export default typeDefs;
