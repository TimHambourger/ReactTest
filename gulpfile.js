var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    reactify = require('reactify');

gulp.task('browserify', function () {
    return browserify({
            entries: './src/appStart.jsx',
            debug: true,
            extensions: '.jsx'
        })
        .transform(reactify, { es6: true })
        .bundle()
        .pipe(source('appStart.js'))
        .pipe(gulp.dest('./build'));
});
