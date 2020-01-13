const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebPackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const fs = require('fs');

module.exports = env => {
  const currentPath = path.join(__dirname);
  const basePath = currentPath + '/.env';
  const envPath = env && env.ENVIRONMENT ? basePath + env.ENVIRONMENT : basePath;
  const finalPath = fs.existsSync(envPath) ? envPath : basePath;
  const fileEnv = dotenv.config({ path: finalPath }).parsed;
  const envKeys = fileEnv ? Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);

    return prev;
  }, {}) : {};

  return {
    entry: {
      polyfill: 'babel-polyfill',
      app: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: '[name].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {},
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.wasm$/,
          type: 'javascript/auto',
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      }),
      new webpack.DefinePlugin(envKeys),
      new CopyWebPackPlugin([
        { from: "assets", to: "assets"}
      ])
    ]
  }
};