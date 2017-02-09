import os             from 'os';
import fs             from 'fs';
import path           from 'path';
import stream         from 'stream'

import _              from 'lodash';
import config         from 'config';
import React          from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOMStream from "react-dom-stream/server";
import serialize      from 'serialize-javascript';


// read container template .
let content = fs.readFileSync(config.path.layout, 'utf-8').split('<%= body %>');
let part1 = _.template(content[0]);
let part2 = _.template(content[1]);
//
/**
 * 模板变量
 * cacheKey 缓存key 没有缓存key 不会缓存
 */
export default function render(tpl, locals = {}){
  //
  let data             = _.clone(config);
  /**
   * 模板变量
   */
  data.page            = tpl                                       ;
  data.url             = this.url                                  ;
  data.theme           = this.theme                                ;
  data.browser         = this.browser                              ;
  data.csrf            = this.csrf            || {}                ;

  data.style           = locals.$style        || ''                ;
  data.pageId          = locals.$id           || tpl               ;
  data.title           = locals.$title        || config.name       ;
  data.keywords        = locals.$keywords     || config.keywords   || [];
  data.description     = locals.$description  || config.description;
  data.referrermeta    = locals.$referrermeta || 'default'         ;
  data.platform        = this.browser.platform|| ''                ;
  /**
   * 保留变量
   */
  locals.$ip           = this.ip                                   ;
  locals.$geo          = this.geo                                  ;
  locals.$url          = this.request.href                         ;
  locals.$query        = this.query                                ;
  locals.$webp         = this.webp                                 ;
  locals.$browser      = this.browser                              ;
  locals.$page         = tpl                                       ;
  locals.$hostname     = os.hostname()                             ;
  locals.$renderTime   = +new Date                                 ;
  locals.$config       = _.pick(config, config.whitelist)          ;
  locals.$referrer     = this.get('Referrer')                      ;
  locals.$user         = this.user                                 ;
  locals.$wechat       = this.wechat                               ;
  locals.$locate       = this.locate                               ;

  // 1. goback
  // 2. referer => -1
  // 3 /detail?back=xxx
  // 4. /
  locals.$back = '';

  if(this.query.$back){
    locals.$back = this.query.$back;
  }

  if(!locals.$back && locals.$referrer){
    locals.$back = !!~locals.$referrer.indexOf(config.host.domain) ? 'javascript:history.back();' : null;
  }

  if(!locals.$back){
    locals.$back = locals.$fallback || '/';
  }

  // assets hash map
  let hash = require(path.join(config.path.public, 'hash.json'));
  let pageFile = require.resolve(`${config.path.page}/${tpl}.jsx`);
  //
  let Page = require(pageFile);

  // load jsx page
  // $disableJavaScript（禁用js）、$serverRenderOnly（仅服务端渲染）应用这两个属性将不会打包组件与页面的js
  data.javascripts = [];
  data.appData = serialize({});
  if(!(locals.$disableJavaScript == true || locals.$serverRenderOnly == true)){
    data.appData = serialize(locals);
    data.javascripts = [ 'vendors', tpl ].map(function(script){
      script += '.js';
      return `/js/${hash[script] || script}`;
    });
  }

  //
  data.pageName = (Page.name).replace(/Page$/, '').toLowerCase();
  data.stylesheets = [ 'main' ].concat([ `${data.pageName}/index` ]).map((style) => {
    style += '.css';
    return `/css/${hash[style] || style}`;
  });

  if(locals.$disableServerRender){
    this.body = [ part1(data), part2(data) ].join('');
  }else{
    var ws = stream.PassThrough();
    var time = process.hrtime();
    console.log(data);
    console.log(part1(data));
    let [pt1, pt2] = [part1(data), part2(data)];
    console.log('pt',pt1,pt2);
    let _html = [];
    ws.write(pt1);
    ReactDOMStream.renderToString(
      <Page {...locals} />
    )
    .on('data', (dt) => {
      _html.push(dt);
    })
    .on('end', () => {
      var diff = process.hrtime(time);
      ws.end(pt2);
    })
    .pipe(ws, { end: false });
    this.type = 'text/html';
    this.body = ws;
  }
}
