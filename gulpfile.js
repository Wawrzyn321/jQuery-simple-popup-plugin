var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;
var cleanCSS = require('gulp-clean-css');
var jshint = require('gulp-jshint')
var babel = require('gulp-babel')
var qunit = require('gulp-qunit');
var fs = require('fs');

function minifyJS() {
    return gulp.src('src/popup.js', { sourcemaps: true })
        .pipe(uglify())
        .pipe(rename({
            basename: 'popup',
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'))
}

function lint() {
    return gulp.src('src/popup.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
}

function moveJS() {
    return gulp.src('src/popup.js')
        .pipe(gulp.dest('dist'))
}

function watchJS() {
    gulp.watch('src/popup.js', gulp.series(lint, minifyJS, moveJS));
}


function minifyCSS() {
    return gulp.src('src/popup-theme.css')
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'popup-theme',
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
}

function moveCSS() {
    return gulp.src('src/popup-theme.css')
        .pipe(gulp.dest('dist'));
}

function watchCSS() {
    gulp.watch('src/popup-theme.css', gulp.series(minifyCSS, moveCSS));
}

function watch() {
    return gulp.parallel(watchCSS, watchJS)();
}


function build(done) {
    return gulp.parallel(
        gulp.series(minifyJS, moveJS),
        gulp.series(minifyCSS, moveCSS)
    )(done);
}

//we need to transpile our file, as phantomJS (used by QUnit) doesn't recognize es6 syntax
function transpileJSForTesting() {
    return gulp.src('./src/popup.js')
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(rename('popup-transpiled.js'))
            .pipe(gulp.dest('./tests'));
}

function test() {
    const testConfig = JSON.parse(fs.readFileSync('tests/test-config.json'));
    return gulp.src('./tests/test-runner.html')
        .pipe(qunit(testConfig));
}

gulp.task('lint', lint);
gulp.task('build', build);
gulp.task('default', watch);
gulp.task('test', gulp.series(transpileJSForTesting, test));
