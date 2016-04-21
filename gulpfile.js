'use strict';

/**
 * TODO
 * 	- Add js hot swap
 */

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

/**
 * Paths and options
 */
const viewPaths = ['**/*.html'];
const stylePaths = ['styles/**/*.scss'];
const jsPaths = ['js/**/*.js',
                 '!js/bundle.js'];

/**
 * Tasks
 */
gulp.task('browser-sync', function() {
    browserSync.use(htmlInjector, {
        files: viewPaths
    });
    browserSync.init({
        server: {
            baseDir: "./"
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
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('styles'))
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
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('js'));
});

gulp.task('default', ['browser-sync', 'sass', 'js'], function() {
    gulp.watch([jsPaths], ['reload']);
    gulp.watch(stylePaths, ['sass']);
    gulp.watch(jsPaths, ['js']);
});

gulp.task('build', ['js', 'sass']);
