const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./base");
const helpers = require("../helpers");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(base, {
  mode: "production",
  devtool: "none",
  output: {
    path: helpers.resolveFromRootPath("dist"),
    filename: "[chunkhash].[name].js",
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
    }),
  ],
});
