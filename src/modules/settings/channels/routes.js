import React from 'react';
import { Route } from 'react-router-dom';
import { MainLayout } from '../../layout/components';
import { ChannelList } from './containers';

const routes = () => (
  <div>
    <Route
      path='/settings/channels/'
      component={() => {
        return <MainLayout content={ <ChannelList queryParams={{}} /> } />
      }}
    />
  </div>
);

export default routes;
