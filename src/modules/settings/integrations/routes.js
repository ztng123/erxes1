import React from 'react';
import { Route } from 'react-router-dom';
import queryString from 'query-string';
import {
  Twitter,
  CreateMessenger,
  EditMessenger,
  IntegrationStore
} from './containers';

const routes = () => [
  <Route
    key="/settings/integrations/createMessenger"
    exact
    path="/settings/integrations/createMessenger"
    component={({ location }) => {
      return (
        <CreateMessenger queryParams={queryString.parse(location.search)} />
      );
    }}
  />,

  <Route
    key="/settings/integrations/editMessenger/:_id"
    exact
    path="/settings/integrations/editMessenger/:_id"
    component={({ match }) => {
      return <EditMessenger integrationId={match.params._id} />;
    }}
  />,

  <Route
    key="/settings/integrations/twitter"
    exact
    path="/settings/integrations/twitter"
    component={() => <Twitter type="link" />}
  />,

  <Route
    key="/service/oauth/twitter_callback"
    path="/service/oauth/twitter_callback"
    component={({ history, location }) => {
      const queryParams = queryString.parse(location.search);

      return (
        <Twitter type="form" history={history} queryParams={queryParams} />
      );
    }}
  />,

  <Route
    key="/settings/integrations"
    exact
    path="/settings/integrations"
    component={() => <IntegrationStore />}
  />
];

export default routes;
