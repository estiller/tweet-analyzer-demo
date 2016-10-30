var gulp = require('gulp');
var ts = require('gulp-typescript');
var less = require('gulp-less');
var path = require('path');
var webpack = require('gulp-webpack');


gulp.task('default', ['compile', 'less'], function () {
    return gulp.src('src/**/*.js')
        .pipe(webpack({
            entry: {
                app: './src/app.js',
            },
            output: {
                filename: 'app.js',
            },
        }))
        .pipe(gulp.dest('src/'));
});

gulp.task('less', function () {
    return gulp.src('src/styles/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('src/styles'));
});


gulp.task("compile", function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({}))
        .js.pipe(gulp.dest('src'));
});



gulp.task("watch", function () {
    gulp.watch('*.less', ['less']);

});
