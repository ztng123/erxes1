const path = require('path');

const {
  override,
  addBabelPlugins,
  removeModuleScopePlugin,
  babelInclude,
} = require("customize-cra");

module.exports = override(
  babelInclude([
    path.resolve("src"),
    path.resolve("../plugins/**/ui"),
  ]),
  addBabelPlugins(
    "@babel/plugin-proposal-class-properties",
  ),
  removeModuleScopePlugin(),
);
