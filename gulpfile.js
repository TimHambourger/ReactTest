var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    reactify = require('reactify'),
    uglify = require('gulp-uglify'),
    vinylBuffer = require('vinyl-buffer');

var PRODUCTION = true;

gulp.task('browserify', function () {
    var bundle = browserify({
            entries: './src/appStart.jsx',
            debug: !PRODUCTION,
            extensions: '.jsx'
        })
        .transform(reactify, { es6: true })
        .bundle()
        .pipe(source('appStart.js'));

    if (PRODUCTION) bundle = bundle
        .pipe(vinylBuffer())
        .pipe(uglify());

    return bundle.pipe(gulp.dest('./build'));
});

gulp.task('set-dev', function () {
    PRODUCTION = false;
});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './lib/*'], ['set-dev', 'default']);
});

gulp.task('default', ['browserify']);

gulp.task('dev', ['watch', 'set-dev', 'default']);
