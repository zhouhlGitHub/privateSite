require('babel-register');
require('babel-polyfill');
var config = require('config');
var server = require('./server');
var isDev = process.env.NODE_ENV !== 'production';
console.log('isDEv', isDev);
if (isDev) {
  var webpack = require('webpack');
  var webpackDevMiddleware = require('koa-webpack-dev-middleware');
  var webpackHotMiddleware = require('koa-webpack-hot-middleware');
  var webpackConfig = require('./webpack.config.dev');
  Object.keys(webpackConfig.entry).forEach(function(name, i) {
    var hotEntry = ['eventsource-polyfill','webpack-hot-middleware/client?reload=true'];// 客户端的js和css修改后页面会检测到update，但是不会生效，需要加上reload参数，然后刷新整个页面]
    webpackConfig.entry[name] = hotEntry.concat(webpackConfig.entry[name]);
  });
  var compile = webpack(webpackConfig);

  server.use(webpackDevMiddleware(compile, {
    noInfo: false, // 是否在命令行中打印编译信息
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    lazy: false,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  }));
  server.use(webpackHotMiddleware(compile), {
    log: () => {}
  });
}
server.listen(config.port, function(){
    console.log('server is running at %s', config.port);
});
