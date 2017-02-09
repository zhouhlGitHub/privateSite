export default function(app, config) {
  if (app.env == 'development') {
    return require('koa-static')(config.path.public);
  } else {
    return function *(next) {
      yield next;
    }
  }
}
