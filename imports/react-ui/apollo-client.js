import { Meteor } from 'meteor/meteor';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions';
import gql from 'graphql-tag';

const { APOLLO_CLIENT_URL, APOLLO_CLIENT_SUBSCRIPTION_URL } = Meteor.settings.public;

const wsClient = new SubscriptionClient(APOLLO_CLIENT_SUBSCRIPTION_URL, {
  reconnect: true,
  connectionParams: {
    token: Meteor.userId(),
  },
});

// Create a normal network interface:
const networkInterface = createNetworkInterface({ uri: APOLLO_CLIENT_URL });

// Attach user credentials
networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      req.options.headers['authorization'] = Meteor.userId() ? `Bearer ${Meteor.userId()}` : null;
      next();
    },
  },
]);

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient);

// Finally, create your ApolloClient instance with the modified network interface
const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});

export const mutate = ({ mutation, variables }) => {
  client.mutate({
    mutation: gql(mutation),
    variables,
  });
};

export default client;
