var express = require('express');
var app = express();
var isDev = process.env.NODE_ENV === 'production' ? false : true;
if (isDev) {
  var webpack = require('webpack');
  var config = require('../build/webpack.dev.config');
  var compiler = webpack(config);
  console.log(config.output.path);
  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  });
  var hotMiddleware = require('webpack-hot-middleware')(compiler);

  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
      hotMiddleware.publish({ action: 'reload' });
      cb();
    })
  });

  app.use(devMiddleware);
  app.use(hotMiddleware);
}
app.listen(9527, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:9527');
});
