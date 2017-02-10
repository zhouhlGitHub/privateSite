import os from 'os';
import uri from 'url';
import config from 'config';
import request from 'superagent';
import qs from 'querystring';
import stream from 'stream';
import logger from 'winston';
import PrettyError from 'pretty-error';
// import render from './middlewares/render';
import render from './middlewares/nunjucks';
let pe = new PrettyError();
export default class Controller {
  send(body) {
    this.ctx.body = body;
  }
  /**
   * render nunjucks template
   * @param {[type]} tpl [template name(without .njk)]
   * @param {[type]} locals [render context]
   * @param {[type]}        [this]
   */
   render(view, locals) {
     render.apply(this, arguments);
    //  let ws = stream.PassThrough();
    //  let self = this;
    //  this.ctx.body = ws;
    //  this.ctx.type = 'text/html';
    //  nunjucks.render(tpl + '.njk', locals, function(err, output) {
    //    if (err) {
    //      ws.end(new Buffer(err.toString()));
    //      return self.throwError(err);
    //    }
    //    ws.write(new Buffer(output));
    //    ws.end();
    //  });
   }
   /**
   * [throwError description]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  throwError(e){
    if(!(e instanceof Error)){
      e = new Error(e);
    }
    logger.error(pe.render(e));
  }
}
