module.exports = {
  name: 'document',
  port: 3017,
  scope: 'document',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'document',
    module: './routes'
  },
  menus:[{"text":"Documents","url":"/documents","icon":"icon-star","location":"mainNavigation"}]
};
