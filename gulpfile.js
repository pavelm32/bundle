const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const webpack = require('webpack');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const del = require('del');

const gulpWebpack = require('gulp-webpack');
const webpackConfig = require('./webpack.config.js');

const buildPath = './public';
const sourcePath = './src';
const paths = {
    templates: {
        pages: `${sourcePath}/templates/pages/*.pug`,
        src: `${sourcePath}/templates/**/*.pug`,
        dest: `${buildPath}`
    },
    styles: {
        src: `${sourcePath}/styles/**/*.scss`,
        dest: `${buildPath}/css/`
    },
    scripts: {
        src: `${sourcePath}/scripts/**/*.js`,
        dest: `${buildPath}/js/`
    }
};

gulp.task('clean', function () {
    return del(buildPath);
});

gulp.task('templates', function () {
    return gulp.src(paths.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.templates.dest));
});

gulp.task('styles', function () {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('scripts', function () {
    return gulp.src('src/scripts/app.js')
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('watch', function () {
    gulp.watch(paths.styles.src, gulp.series('styles'));
    gulp.watch(paths.templates.src, gulp.series('templates'));
    gulp.watch(paths.scripts.src, gulp.series('scripts'));
});

gulp.task('server', function() {
    browserSync.init({
        server: buildPath
    });
    browserSync.watch(buildPath + '/**/*.*', reload);
});

gulp.task('default', gulp.series(
    "clean",
    gulp.parallel("styles", "scripts", "templates"),
    gulp.parallel("watch", "server")
));