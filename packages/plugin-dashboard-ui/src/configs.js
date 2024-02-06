module.exports = {
  name: 'dashboard',
  port: 3017,
  scope: 'dashboard',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'dashboard',
    module: './routes'
  },
  menus:[{"text":"Dashboards","url":"/dashboards","icon":"icon-star","location":"mainNavigation"}]
};
