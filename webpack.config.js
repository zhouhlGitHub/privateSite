var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const debug = process.env.NODE_ENV !== 'production';

var entries = getEntry('client/pages/**/*.jsx', 'client/pages/');
var chunks = Object.keys(entries);
var config = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/static/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[chunkhash].js?'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css!less')
      },
      {
        test: /(\.jsx$)|(page\.js)/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=8192&name=images/[name].[hash].[ext]'
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendors',
      chunks: chunks,
      minChunks: chunks.length
    }),
    new ExtractTextPlugin('css/[name].[hash].css'),
    debug ? function() {} : new UglifyJsPlugin({
      compress: {
        warnings: false
      },
      except: ['$super', '$', 'exports', 'require']
    })
  ]
};
// var pages = Object.keys(getEntry('client/pages/**/*.njk', 'client/pages/'));
// pages.forEach(function(pathname) {
//   var conf = {
//     filename: '../server/views/' + pathname + '.njk',
//     template: 'client/pages/' + pathname + '.njk',
//     inject: false
//   };
//   if (pathname in config.entry) {
//     conf.favicon = 'client/images/favicon.ico';
//     conf.inject = 'body';
//     conf.chunks = ['vendors', pathname];
//     conf.hash = true;
//   }
//   config.plugins.push(new HtmlWebpackPlugin(conf));
// });
module.exports = config;

function getEntry(globPath, pathDir) {
  var files = glob.sync(globPath);
  var entries = {},
      entry, dirname, basename, pathname, extname;
  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.join(dirname, basename);
    pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
    entries[pathname] = ['./' + entry];
  }
  return entries;
}
