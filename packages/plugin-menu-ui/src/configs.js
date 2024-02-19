module.exports = {
  srcDir: __dirname,
  name: "menu",
  port: 4012,
  scope: "menu",
  exposes: {
    "./routes": "./src/routes.tsx",
  },
  routes: {
    url: "http://localhost:4012/remoteEntry.js",
    scope: "menu",
    module: "./routes",
  },
  menus: [
    {
      text: "Menus",
      url: "/menus",
      icon: "icon-star",
      location: "mainNavigation",
    },
  ],
};
