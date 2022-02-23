const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const InterpolateHtmlPlugin = require("interpolate-html-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const configs = require("./plugin-src/configs");
const { port = 3009 } = configs;

const exposes = {};

for (const expose of Object.keys(configs.exposes || {})) {
  exposes[expose] = configs.exposes[expose].replace("src", "plugin-src");
}

// replace accordingly './.env' with the path of your .env file
require("dotenv").config({ path: "./.env" });

const deps = require("./package.json").dependencies;
const depNames = Object.keys(deps);

const shared = {};

for (const name of depNames) {
  shared[name] = {
    singleton: true,
  };
}

module.exports = {
  output: {
    publicPath: `http://localhost:${port}/`,
    filename: "[name].[contenthash].bundle.js",
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: true,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    fallback: {
      path: require.resolve("path-browserify"),
      timers: require.resolve("timers-browserify"),
    },
  },

  devServer: {
    port: port,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "../../erxes-ui/src"),
          path.resolve(__dirname, "../../ui-contacts/src"),
          path.resolve(__dirname, "../../ui-inbox/src"),
          path.resolve(__dirname, "../../ui-settings/src"),
          path.resolve(__dirname, "../../ui-cards/src"),
          path.resolve(__dirname, "../../ui-forms/src"),
          path.resolve(__dirname, "../../ui-leads/src"),
          path.resolve(__dirname, "../../ui-products/src"),
          path.resolve(__dirname, '../../ui-engage/src'),
          path.resolve(__dirname, "plugin-src"),
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-typescript",
              "@babel/preset-react",
              "@babel/preset-env",
            ],
            plugins: [["@babel/transform-runtime"]],
          },
        },
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: "public", // can modify `static` to another name or get it from `process`
    }),
    new ModuleFederationPlugin({
      name: configs.name,
      filename: "remoteEntry.js",
      remotes: {
        coreui: "coreui@http://localhost:3000/remoteEntry.js",
      },
      exposes,
      shared: {
        ...shared,
        "@erxes/ui": {
          requiredVersion: "1.0.0",
          singleton: true,
        },
        dayjs: {
          requiredVersion: deps['dayjs'],
          singleton: true
        }
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
