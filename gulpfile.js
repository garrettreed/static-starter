require("dotenv").config();
const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const mustache = require("gulp-mustache");
const concat = require("gulp-concat");
const gulpif = require("gulp-if");

const isProdEnv = process.env.ENVIRONMENT === "production";
console.log(`Building for ${process.env.ENVIRONMENT}`);

const paths = {
    styles: {
        src: ["libs/**/*.css", "styles/**/*.scss"],
        dest: "public/dist/"
    },
    scripts: {
        src: ["libs/**/*.js", "js/**/*.js"],
        dest: "public/dist/"
    },
    templates: {
        src: ["templates/**/*.mustache", "!templates/partials/**"],
        dest: "public/"
    }
};

function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(concat("dist.css"))
        .pipe(gulpif(!isProdEnv, sourcemaps.write(".")))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream({ match: "**/*.css" }));
}

function scripts() {
    return gulp
        .src(paths.scripts.src)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat("dist.js"))
        .pipe(babel({ presets: ["@babel/preset-env"] }))
        .pipe(uglify())
        .on("error", swallowError)
        .pipe(gulpif(!isProdEnv, sourcemaps.write(".")))
        .pipe(gulp.dest(paths.scripts.dest));
}

function templates() {
    return gulp
        .src(paths.templates.src)
        .pipe(mustache("data.json", { extension: ".html" }, {}))
        .pipe(gulp.dest(paths.templates.dest));
}

function watch() {
    gulp.watch(paths.scripts.src, scripts).on("change", browserSync.reload);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates).on("change", browserSync.reload);
}

function swallowError(error) {
    console.log(error.toString());
    this.emit("end");
}

function serve() {
    browserSync.init({
        server: "public"
    });
    watch();
}

const build = gulp.parallel(styles, scripts, templates);

exports.styles = styles;
exports.scripts = scripts;
exports.templates = templates;
exports.watch = watch;
exports.build = build;
exports.default = gulp.series(build, serve);
