import React from 'react';
import { Route } from 'react-router-dom';
import { MainLayout } from '../layout/components';
import Inbox from '../inbox/containers/Inbox';

const routes = () => (
  <Route
    exact
    path="/inbox"
    component={() => <MainLayout content={<Inbox title="There" />} />}
  />
);

export default routes;
