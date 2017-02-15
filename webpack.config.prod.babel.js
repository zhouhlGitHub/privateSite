var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var config = require('config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const debug = process.env.NODE_ENV !== 'production';

var entries = getEntry('client/pages/**/index.js', 'client/');
var chunks = Object.keys(entries);
var config = {
  entry: entries,
  output: {
    path: config.path.public,
    filename: 'js/[name].js',
    publicPath: '/'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.js', '.vue', '.scss'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.scss$/,
        loader: 'sass-loader'
      }
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules|server/,
        loader: 'babel',
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', '!css-loader!postcss-loader')
      }
    ]
  },
  postcss: [
    // require('precss'),
    // require('postcss-import'),
    // require('postcss-mixins'),
    // require('postcss-nested'),
    // require('postcss-custom-properties')(),
    // require('postcss-math'),
    require('autoprefixer')
  ],
  plugins: [
    new webpack.BannerPlugin("copyright zhouhuilin private!"),
    new ExtractTextPlugin("css/[name].css"),
    new CommonsChunkPlugin({
      name: 'vendors',
      chunks: chunks,
      minChunks: chunks.length
    }),
    // new webpack.optimize.CommonsChunkPlugin("commons", "commons.js"),
    new webpack.HotModuleReplacementPlugin(),
  ],

};

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
