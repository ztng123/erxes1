import React from 'react';
import { Route } from 'react-router-dom';
import { MainLayout } from '../layout/components';
import { Manage } from '../fields/containers';

const routes = () => (
  <div>
    <Route
      path="/fields/manage/:contentType/:contentTypeId?"
      component={({ match }) => {
        const { contentType, contentTypeId } = match.params;

        return (
          <MainLayout
            content={
              <Manage contentType={contentType} contentTypeId={contentTypeId} />
            }
          />
        );
      }}
    />
  </div>
);

export default routes;
