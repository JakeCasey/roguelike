var gulp = require('gulp');
var sass = require('gulp-sass');


gulp.task('sass', function(){
return gulp.src('src/App.scss')
  .pipe(sass())
  .pipe(gulp.dest('src'));

});

gulp.task('test', function() {
  console.log('gulp works!');


});
