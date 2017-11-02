import React from 'react';
import { Route } from 'react-router-dom';
import { MainLayout } from '../../layout/containers';
import { TopicList, CategoryList } from './containers';

const routes = () => [
  <Route
    key="/settings/knowledgebase/list"
    exact={true}
    path="/settings/knowledgebase/list"
    component={() => <MainLayout content={<TopicList queryParams={{}} />} />}
  />,

  <Route
    key="/settings/knowledgebase/categories"
    exact={true}
    path="/settings/knowledgebase/categories"
    component={() => <MainLayout content={<CategoryList queryParams={{}} />} />}
  />
];

export default routes;
