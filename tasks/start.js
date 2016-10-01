'use strict';

var childProcess = require('child_process');
var electron = require('electron');
var gulp = require('gulp');

//require('electron-compile').init(__dirname, './js/main')

gulp.task('start', ['build', 'watch'], function () {
    childProcess.spawn(electron, ['./app'], {
        stdio: 'inherit'
    })
    .on('close', function () {
        // User closed the app. Kill the host process.
        process.exit();
    });
});
