/**
 * Dependencies.
 */
var gulp = require('gulp'),
    util = require('gulp-util'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    buildPath = './build/',
    sourcePath = './public/src/';

// assets is where you define your application assets and you can pass them into gulp.
var assets = require('./assets');

// the default task that is run with the command 'gulp'
gulp.task('default', function() {

    // concat and minify your css
    gulp.src(sourcePath + 'css/*.css').pipe(concat('styles.css')).pipe(minifycss()).pipe(gulp.dest(buildPath + 'css'));

    //minify
    gulp.src(sourcePath + 'bower_components/requirejs/require.js').pipe(uglify()).pipe(gulp.dest(buildPath + 'bower_components/requirejs/'));

    // concat and minify your css
    gulp.src([sourcePath +'app/app.js', sourcePath + '**/*.js']).pipe(concat('app.js')).pipe(uglify()).pipe(gulp.dest(buildPath));
});