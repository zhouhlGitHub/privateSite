import config from 'config';
import koa from 'koa';
import router from 'koa-routeify';

import staticServer from './middlewares/staticServer';
import browser from './middlewares/browser';
const app = koa();
app.use(browser(app, config));
app.use(staticServer(app, config));
app.use(router(app, config.router));

export default app;
