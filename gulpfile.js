const gulp = require('gulp')
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const tsify = require("tsify");
var buffer = require('vinyl-buffer');


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
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
})
