var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ngDependencyLint = require('gulp-ng-dependency-lint');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: 'www/app/**/*.js'
};

gulp.task('default', ['sass']);

/* Ionic CLI for v2 sass fix */
gulp.task('serve:before', ['default', 'watch']);
gulp.task('run:before', ['default']);
/* Ionic CLI for v2 sass fix */

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function () {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// to automatically remove 
gulp.task('ng-di-rm', function () {
  return gulp.src(paths.js)
    .pipe(ngDependencyLint({ removeDependency: true }))
    .pipe(gulp.dest('dist'));
});

// this will only print unused dependency list
gulp.task('ng-di-lint', function () {
  return gulp.src(paths.js)
    .pipe(ngDependencyLint());
});
