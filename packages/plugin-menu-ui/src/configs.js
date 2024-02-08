module.exports = {
  name: 'menu',
  port: 3017,
  scope: 'menu',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'menu',
    module: './routes'
  },
  menus:[{"text":"Menus","url":"/menus","icon":"icon-star","location":"mainNavigation"}]
};
