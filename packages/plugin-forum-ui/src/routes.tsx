import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import queryString from 'query-string';

const Categories = asyncComponent(() =>
  import(
    /* webpackChunkName: "List - Forums" */ './containers/Categories/CategoriesList'
  )
);

const PageList = asyncComponent(() =>
  import(/* webpackChunkName: "CustomerDetails" */ './containers/Pages/List')
);

const PageDetails = asyncComponent(() =>
  import(/* webpackChunkName: "CustomerDetails" */ './containers/Pages/Detail')
);

const PostList = asyncComponent(() =>
  import(
    /* webpackChunkName: "CustomerDetails" */ './containers/PostsList/List'
  )
);

const PostDetails = asyncComponent(() =>
  import(
    /* webpackChunkName: "CustomerDetails" */ './containers/PostsList/PostDetail'
  )
);

const PermissionGroups = asyncComponent(() =>
  import(
    /* webpackChunkName: "CustomerDetails" */ './containers/PermissionGroups/PermissionList'
  )
);

const PermissionGroupDetail = asyncComponent(() =>
  import(
    /* webpackChunkName: "CustomerDetails" */ './containers/PermissionGroups/Detail'
  )
);

const SubscriptionProducts = asyncComponent(() =>
  import(
    /* webpackChunkName: "CustomerDetails" */ './containers/SubscriptionProduct/List'
  )
);

const layout = () => {
  const lastVisited = localStorage.getItem('erxes_forum_url') || 'posts';

  return <Redirect to={`/forums/${lastVisited}`} />;
};

const pageList = () => {
  localStorage.setItem('erxes_forum_url', 'pages');

  return <PageList />;
};

const pageDetail = ({ match }) => {
  const id = match.params.id;

  return <PageDetails id={id} />;
};

const postList = () => {
  localStorage.setItem('erxes_forum_url', 'posts');

  return <PostList />;
};

const postDetail = ({ match }) => {
  const id = match.params.id;

  return <PostDetails _id={id} />;
};

const permissionGroups = ({ location, history }) => {
  const queryParams = queryString.parse(location.search);

  return <PermissionGroups queryParams={queryParams} history={history} />;
};

const categories = () => {
  return <Categories />;
};

const permissionGroupDetail = () => {
  return <PermissionGroupDetail />;
};

const subscriptionProducts = ({ location, history }) => {
  const queryParams = queryString.parse(location.search);

  return <SubscriptionProducts queryParams={queryParams} history={history} />;
};

const routes = () => {
  return (
    <React.Fragment>
      <Route path="/forums" exact={true} component={layout} />

      <Route
        key="/forums/pages"
        exact={true}
        path="/forums/pages"
        component={pageList}
      />

      <Route
        key="/forum/pages/:id"
        exact={true}
        path="/forum/pages/:id"
        component={pageDetail}
      />

      <Route
        key="/forums/posts"
        exact={true}
        path="/forums/posts"
        component={postList}
      />

      <Route
        key="/forums/posts/:id"
        exact={true}
        path="/forums/posts/:id"
        component={postDetail}
      />

      <Route
        key="/forums/categories"
        exact={true}
        path="/forums/categories"
        component={categories}
      />

      <Route
        key="/forums/permission-groups"
        exact={true}
        path="/forums/permission-groups"
        component={permissionGroups}
      />

      <Route
        key="/forums/permission-groups/:permissionGroupId"
        exact={true}
        path="/forums/permission-groups/:permissionGroupId"
        component={permissionGroupDetail}
      />

      <Route
        key="/forums/subscription-products"
        exact={true}
        path="/forums/subscription-products"
        component={subscriptionProducts}
      />
    </React.Fragment>
  );
};

export default routes;
