import config from 'config';
import koa from 'koa';
import router from 'koa-routeify';
import staticServer from 'koa-static';
import session from 'koa-generic-session';
import sessionStore from 'koa-session-mongoose';
import browser from './middlewares/browser';
import Auth from './middlewares/auth';
const app = koa();
app.keys = ['koa', 'zhhl', 'blog'];
app.use(browser(app, config));
app.use(staticServer(config.path.public,{
  hidden: true,
  maxage: 60*1000
}));
let url = app.path;
if (Arrary.isArray(config.loginUrls)) {
  if (config.loginUrls.find(loginUrl => loginUrl.test(url))) {
    app.use(Auth());
  }
}
// app.use(session({
//   store: sessionStore.create(),
//   collection: 'koaSession',
//   connection: db,
//   expires: 30*60*1000,
//   model: 'KoaSession'
// }))
app.use(router(app, config.router));

export default app;
