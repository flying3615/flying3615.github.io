var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

//script paths
var jsFiles = ['js/custom.js','js/library.js']
    jsDest = 'dist/js';

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('css', function () {
    gulp.src(['css/*.css','!css/*.min.css'])
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});