import config from 'config';
import koa from 'koa';
import router from 'koa-routeify';
import staticServer from 'koa-static';
console.log(config, '======');
import browser from './middlewares/browser';
const app = koa();
app.use(browser(app, config));
app.use(staticServer(config.path.public,{
  hidden: true,
  maxage: 60*1000
}));
app.use(router(app, config.router));

export default app;
