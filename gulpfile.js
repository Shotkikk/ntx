// Libraries
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var htmlmin = require('gulp-htmlmin');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var stripComments = require('gulp-strip-comments');
var stripCssComments = require('gulp-strip-css-comments');
var browserSync = require('browser-sync').create();


// // Minify pipe: app/*.html -> dist/*.min.html
// gulp.task('html', function () {
//     return gulp.src('app/*.html')
//         .pipe(plumber())
//         .pipe(stripComments())
//         .pipe(htmlmin({collapseWhitespace: true}))
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest('dist/'))
//         .pipe(browserSync.reload({
//             stream: true
//         }));
// });

// Copy pipe: app/*.html -> dist/*.html
gulp.task('html', function () {
    return gulp.src('app/html/**/*.html')
        .pipe(plumber())
        .pipe(gulp.dest('dist/html'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Copy pipe: images/*.png -> images/*.png
gulp.task('img', function () {
    return gulp.src('app/images/**/*.png')
        .pipe(plumber())
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify pipe: app/scss/**/*.scss + node_modules -> app/css/style.min.css
gulp.task('css', function () {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'app/scss/**/*.scss'
    ])
        .pipe(plumber())
        .pipe(sass())
        .pipe(concat('styles.min.css'))
        .pipe(autoprefixer())
        .pipe(stripCssComments())
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy pipe: node_modules -> app/js/scripts.min.css
gulp.task('js', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
        .pipe(plumber())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify pipe: app/js/**/*.js -> app/js/*.js
gulp.task('js-app', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(plumber())
        .pipe(stripComments())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Copy pipe: app/fonts/**/*.{ttf,otf} -> app/fonts/**/*.{ttf,otf}
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*.{ttf,otf}')
        .pipe(plumber())
        .pipe(gulp.dest('dist/fonts'))
});

// Make server on :3000 with new tab
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist',
            index: 'html/index.html'
        }
    })
});

// Watch changes on app/**/*.*
gulp.task('watch', ['browserSync'], function () {
    gulp.watch('app/html/**/*.html', ['html']);
    gulp.watch('app/img/**/*.png', ['img']);
    gulp.watch('app/scss/**/*.scss', ['css']);
    gulp.watch('app/fonts/**/*.{ttf,otf,woff}', ['fonts']);
    gulp.watch('app/js/**/*.js', ['js']);
});

// Building app/**/*.* to dist/**/*.* (Commands combo)
gulp.task('build', ['html', 'img', 'css', 'fonts', 'js', 'js-app']);