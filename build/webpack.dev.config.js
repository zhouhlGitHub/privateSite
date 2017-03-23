var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

var config = require('./webpack.config');
// var devClient = 'webpack-hot-middleware/client';
var devClient = './build/dev-client';
Object.keys(config.entry).forEach(function(name, i) {
  var extras = [devClient];
  config.entry[name] = extras.concat(config.entry[name]);
});

config.output.publicPath = '/';
config.plugins = [

  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),

  new HtmlWebpackPlugin({
    filename: 'app/index/index.html',
    template: path.resolve(__dirname, '../app/index/index.html'),
    inject: true,
  })
];

module.exports = config;
