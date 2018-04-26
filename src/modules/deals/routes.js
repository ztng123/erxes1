import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { Home } from './containers';

const routes = () => [
  <Route
    key="deals"
    exact
    path="/deals"
    render={() => <Redirect to="/deals/board" />}
  />,
  <Route
    key="deals/board"
    exact
    path="/deals/board"
    component={({ history, location }) => {
      const queryParams = queryString.parse(location.search);

      return <Home queryParams={queryParams} history={history} />;
    }}
  />
];

export default routes;
