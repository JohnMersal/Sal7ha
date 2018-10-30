const gulp          = require('gulp');
const imagemin      = require('gulp-imagemin');
const uglify        = require('gulp-uglify');
const sass          = require('gulp-sass');
const concat        = require('gulp-concat');
const browserSync   = require('browser-sync').create();
const sourcemaps    = require('gulp-sourcemaps');
const del           = require('del');

/*
  -- TOP LEVEL FUNCTIONS --
  gulp.task - Define tasks
  gulp.src - Point to files to use
  gulp.dest - Points to folder to output
  gulp.watch - Watch files and folders for changes
*/

// Copy All HTML files
gulp.task('copyHtml', function(){
  gulp.src('src/*.html')
      .pipe(gulp.dest('dist'));
});

// Copy Font files
gulp.task('copyFonts', function(){
  gulp.src('src/fonts/*')
      .pipe(gulp.dest('dist/css/fonts/'));
});

// cleaning files
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// Optimize Images
gulp.task('imageMin', () =>
  gulp.src('src/images/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
          plugins: [
              {removeViewBox: false},
              {cleanupIDs: false}
          ]
      })
    ]))
    .pipe(gulp.dest('dist/images'))
);

// Compile Sass
gulp.task('sass', function(){
  gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/sass/*.scss'])
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/css'))
      .pipe(sourcemaps.write())
      .pipe(browserSync.stream());
});


// Scripts
gulp.task('scripts', function(){
  gulp.src(['node_modules/bootstrap/dist/js/bootstrap.bundle.js', 'src/js/*.js'])
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

// Serving all
gulp.task('start', ['sass'], function() {
    browserSync.init({
        server: "./dist/"
    });
    gulp.watch('src/js/*.js', ['bootstrap']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/images/**/*', ['imageMin']);
    gulp.watch('src/*.html', ['copyHtml']);
    gulp.watch('src/fonts/*', ['copyFonts']);
    gulp.watch("src/sass/*.scss", ['sass']);
    gulp.watch("dist/*.html").on('change', browserSync.reload);
});


gulp.task('default', ['start']);
gulp.task('build', ['clean:dist', 'copyFonts', 'copyHtml', 'imageMin', 'sass', 'scripts']);



