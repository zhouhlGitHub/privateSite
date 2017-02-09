import nunjucks from 'nunjucks';
import config from 'config';

let env = nunjucks.configure('/', {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
  noCache: config.debug
});

export default env;
