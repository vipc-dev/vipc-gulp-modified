var path = require('path');
var gulp = require('gulp');

var modified = require('./../index');

var paths = {
  modified: 'src/*'
};

var srcPath = path.relative(__dirname, 'src');

gulp.task('default', function() {
  return gulp.src(paths.modified)
    .pipe(modified(srcPath, './modified.json'))
    .pipe(gulp.dest('./'));
});