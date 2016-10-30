var gulp = require('gulp');
var ts = require('gulp-typescript');
var less = require('gulp-less');
var path = require('path');
var tsProject = ts.createProject("tsconfig.json");


gulp.task('less', function () {
    return gulp.src('src/styles/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('src/styles'));
});


gulp.task("compile", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('src'));
});



gulp.task("watch", function () {
    gulp.watch('*.less', ['less']);

});
