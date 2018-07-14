
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helpers = require('../helpers');

const srcPath = helpers.resolveFromRootPath('src');

module.exports = {
  context: srcPath,
  entry: {
    app: [
      './index.tsx',
    ],
    appStyles: [
      './styles/_base.scss',
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      "@material-ui/core": "@material-ui/core/es",
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        loader: 'ts-loader',
      },
      {
        test: /\.scss$/,
        exclude: '/node_modules/',
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
      },
      {
        test: /\.(png|jpg|ico)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/png',
      },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendorGroup: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          enforce: true,
        },
        mockGroup: {
          test: /[\\/]data[\\/]mock[\\/]/,
          name: "mock.data",
          enforce: true,
        },
        geoGroup: {
          test: /[\\/]data[\\/]geo[\\/]/,
          name: "geo.data",
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      hash: true,
      chunks: ['manifest', 'vendor', 'mock.data', 'geo.data', 'app', 'appStyles'],
      chunksSortMode: 'manual',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'REST_ENV': JSON.stringify(process.env.REST_ENV),
        'BASE_API_URL': JSON.stringify(process.env.BASE_API_URL),
      },
    }),
  ],
}
