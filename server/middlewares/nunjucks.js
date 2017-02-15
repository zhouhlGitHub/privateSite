import nunjucks from 'nunjucks';
import config from 'config';
import path from 'path';
import _ from 'lodash';
import stream from 'stream';

let env = nunjucks.configure(path.join(__dirname, '../views/njk/'), {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
  noCache: config.debug
});

export default function render(tpl, locals = {}) {
  let data = _.clone(config);
  data.page            = tpl                                       ;
  data.url             = this.url                                  ;
  data.theme           = this.theme                                ;
  data.browser         = this.browser                              ;
  data.csrf            = this.csrf            || {}                ;

  data.style           = locals.$style        || ''                ;
  data.pageId          = locals.$id           || tpl               ;
  data.title           = locals.$title        || config.name       ;
  data.keywords        = locals.$keywords     || config.keywords   ;
  data.description     = locals.$description  || config.description;
  data.referrermeta    = locals.$referrermeta || 'default'         ;

  let hash = require(config.path.hash);
  data.javascripts = ['vendors', `${tpl}/index`].map((script) => {
    script += '.js';
    return `/js/${hash[script] || script}`;
  });
  data.stylesheets = ['common', `${tpl}/index`].map(style => {
    style += '.css';
    return `/css/${hash[style] || style}`;
  });

  let self = this;
  let ws = stream.PassThrough();
  this.ctx.body = ws;
  this.ctx.type = 'text/html';
  locals = _.merge(locals, data);
  env.render(tpl + '.njk', locals, function(err, output){
    if (err) {
      ws.end(new Buffer(err.toString()));
      return self.throwError(err);
    }
    ws.write(new Buffer(output));
    ws.end();
  });
}
