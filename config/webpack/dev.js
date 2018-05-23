const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./base");
const helpers = require("../helpers");

const hotReloadingEntries = ["react-hot-loader/patch"];

module.exports = merge.strategy({
  entry: "prepend",
})(base, {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    app: hotReloadingEntries,
    appStyles: hotReloadingEntries,
  },
  output: {
    path: helpers.resolveFromRootPath("dist"),
    filename: "[name].js",
  },
  devServer: {
    contentBase: helpers.resolveFromRootPath("dist"),
    inline: true,
    host: "localhost",
    port: 8080,
    stats: "minimal",
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
});
