import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import del from 'del';
import rename from 'gulp-rename';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';
import requireDir from 'require-dir';

let config;
if (process.env.CONFIG_ENV) {
  let { NODE_ENV } = process.env;
  process.env.NODE_ENV = process.env.CONFIG_ENV;
  config = require('config');
  process.env.NODE_ENV = NODE_ENV;
} else {
  config = require('config');
}

// requireDir('./client/tasks');

gulp.task('default', ['server', 'client']);
gulp.task('client', function(cb) {
  console.log('debug: ' + config.debug);
  //runSequence('clean');
  cb();
});
gulp.task('server', function(callback) {
  nodemon({
    watch: [ 'server/' ],
    ext: 'njk js',
    ignore: [ 'node_modules/' ]
  })
  .on('start', function() {
    gutil.log('open http://localhost: ' + config.port);
  })
  .on('restart', function() {
    gutil.log('server restarted!');
  });
  callback && callback();
});

gulp.task('clean', function(cb) {
  del([
    './public/*'
  ], {
    force: true
  }).then(function(paths) {
    gutil.log('delete files: \n' + paths.join('\n'));
    cb();
  }, function() {
    gutil.log(arguments);
  });
});
