const gulp = require('gulp')
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");

gulp.task('default', function () {
    return browserify({
        basedir: './src',
        debug: true,
        entries: ['2048.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'))
})
