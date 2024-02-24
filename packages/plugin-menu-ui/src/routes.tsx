import React from 'react';
import { Route } from 'react-router-dom';

const routes = () => {
  return (
    <Route
      path="/menus/"
      render={({ location }) => {
        // 새 탭에서 외부 URL 열기
        window.open('https://erxes.oopy.io/', '_blank');
        return null;
      }}
    />
  );
};

export default routes;
