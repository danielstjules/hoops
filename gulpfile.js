var gulp   = require('gulp');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');

var pkg    = require('./package.json');
var banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' *',
  ' * @version   <%= pkg.version %>',
  ' * @link      <%= pkg.homepage %>',
  ' * @author    <%= pkg.author %>',
  ' * @license   <%= pkg.license %>',
  ' */\n\n'
].join('\n');

var paths = {
  scripts: './lib/*.js',
  dist: './dist/'
};

gulp.task('clean', function() {
  gulp.src(paths.dist + '*', {read: false})
    .pipe(rimraf());
});

gulp.task('minify', function() {
  gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename(function(path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('dist', ['clean', 'minify']);
