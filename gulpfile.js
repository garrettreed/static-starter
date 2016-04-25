'use strict';

/*
 * Gulp plugins.
 */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const htmlInjector = require("bs-html-injector");
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const mustache = require('gulp-mustache');

/**
 * Paths and options
 */
const templatePaths = ['templates/**/*.mustache'];
const partialPaths = ['partials/**/*.mustache'];
const stylePaths = ['styles/**/*.scss'];
const jsPaths = ['js/**/*.js', '!js/bundle.js'];

const buildPath = './build';

/**
 * Tasks
 */
gulp.task('browser-sync', function() {
    browserSync.use(htmlInjector, {
        files: `${buildPath}/*.html`
    });
    browserSync.init({
        server: {
            baseDir: buildPath
        }
    });
 });

gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('sass', function() {
    return gulp.src(stylePaths)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('bundle.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${buildPath}/styles`))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('js', function() {
    return gulp.src(jsPaths)
        .pipe(sourcemaps.init())
        .pipe(babel({
    		presets: ['es2015'],
            compact: true
		}))
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${buildPath}/js`));
});

gulp.task('views', function() {
    return gulp.src("./templates/*.mustache")
	   .pipe(mustache(
           {},
           {extension: '.html'},
           {}
       ))
       .pipe(gulp.dest(buildPath));
});

gulp.task('default', ['views', 'sass', 'js', 'browser-sync'], function() {
    gulp.watch(jsPaths, ['reload']);
    gulp.watch(stylePaths, ['sass']);
    gulp.watch(jsPaths, ['js']);
    gulp.watch([partialPaths, templatePaths], ['views']);
});

gulp.task('build', ['views', 'js', 'sass']);
