/**
 * [detectApp description]
 * @param  {[type]} query [description]
 * @return {[type]}       [description]
 */
function detectApp(query) {
  let pattern = {
    meituan : /AgroupB/    ,
    maoyan  : /AmovieB/    ,
    samsung : /samsung/    ,
    pptv    : /mypptv/     ,
    toutiao : /toutiao/    ,
    piaofang: /pf/         ,
    imeituan: /imeituan/   ,
    jinli   : /jinlirl/    ,
    dianping: /Adianping-novaB/
  },

  matches = Object.keys(pattern).filter( (key) => {
    return pattern[key].test(query.utm_campaign);
  });

  var data = {};

  if(matches.length){
    data[ 'name' ] = matches[0]
  }

  if(query.version_name || query.utm_term){
    data[ 'version' ] = query.version_name   || query.utm_term;
  }

  return data;
};

function detectPlatform(ua){
  const platformMap = {
    ios    : /iphone|ipad/i ,
    macos  : /Mac OS/       ,
    android: /Android/
  };
  let matchs = Object.keys(platformMap).filter((key)=> {
    return platformMap[key].test(ua)
  });
  return matchs.length > 0 ? matchs[0] : 'unknow';
};

function detectPlatformVersion(ua){
  const platformMap = {
    ios    : / OS (\d+_\d+(_\d+)?) like Mac OS/,
    macos  : /Intel Mac OS X (\d+_\d+_\d+)/,
    android: /Android (\d\.\d)/
  };
  let matchs = Object.keys(platformMap).filter((key)=> {
    return platformMap[key].test(ua)
  });
  return matchs.length > 0 ? platformMap[matchs[0]].exec(ua)[1].replace(/_/g, '.') : 'unknow';
};

function parseVender(ua){
  const venderMap = {
    samsung: /samsung|sm/i,
    apple  : /apple/i
  }
  return (Object.keys(venderMap).filter((vender)=> venderMap[vender].test(ua)) || [])[0] || 'N/A'
}

function parseUserAgent(ua) {
  let name, version;
  //NOTE: THIS ORDER IS VERY !!!IMPORTANT!!!
  const browserMap = {
    maoyan    : /(?:movie|Maoyan(?:\/Android)?)\/(\d\.\d)/i   , // movie/5.9.0/190, Maoyan/Android/6.6.0 and Maoyan/7.6.0/MTNB
    wechat    : /MicroMessenger\/(\d\.\d\.\d)/i               , // MicroMessenger/6.2.4
    daxiang   : /XM\/(\d\.\d\.\d)/i                           ,
    meituan   : /Mobile(?:.*MeituanGroup)?\/([\w.]+)$/        ,
    dianping  : /dp\/com\.dianping.*\/(\d\.\d\.\d)/           ,
    qq        : /QQ\/(\d\.\d\.\d)/i                           , // QQ/6.2
    weibo     : /weibo__(\d\.\d\.\d)/i                        , // Weibo (iPhone7,2__weibo__5.4.0__iphone__os8.3)
    taobao    : /TB\/(\d\.\d\.\d)/                            ,
    moviepro  : /moviepro/                                  ,
    safari    : /(?:iphone|ipad).*Safari\/(\d+\.\d+\.\d+)?/i  ,
    qqbrowser : /MQQBrowser\/(\d\.\d)/i                       ,
    qqmusic   : /QQMusic\/(\d+\.\d+\.\d+)/                    ,
    mogujie   : /Mogujie4iPhone\/(\d+\.\d+\.\d+)/             ,
    chrome    : /Chrome\/(\d+\.\d+\.\d+)|CriOS\/([\d\.]+)/i   ,
  };
  let matchs = Object.keys(browserMap).filter( (browserName) => {
    return browserMap[ browserName ].test(ua);
  });

  name    = matchs.length > 0 ? matchs[0]                      : 'unknow';
  version = name != 'unknow'  ? browserMap[ name ].exec(ua)[1] : 'unknow';
  return {
    name    : name              ,
    version : version           ,
    platform: detectPlatform(ua),
    vender  : parseVender(ua)   ,
    ua      : ua                ,
    platformVersion: detectPlatformVersion(ua)
  };
}


function detectBrowserCore(ua){
  var match = /(chrome|safari)\/(\d+)/i.exec(ua);
  if(match){
    return {
      name: match[1].toLowerCase(),
      version: parseInt(match[2], 10)
    };
  }
}


export default function(){
  return function*(next){

    const ua = this.get('User-Agent');
    //
    this.browser = parseUserAgent(ua);
    //
    let client = detectApp(this.query);
    if(!this.browser.name || !!~['unknow', 'chrome', 'safari'].indexOf(this.browser.name)) {
      // query 中能识别出可靠的浏览器后, 则将其它信息也写入 this.browser
      Object.assign(this.browser, client);
    }

    this.browser.core = detectBrowserCore(ua);

    let webviewlist = 'maoyan wechat daxiang meituan dianping qq weibo taobao';
    this.browser.type = !!~webviewlist.indexOf(this.browser.name) ? 'webview' : 'normal';

    yield next;
  }
};
