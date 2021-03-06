/* jshint node:true */

'use strict';

module.exports = function(config) {

    config.set({

        basePath: '',

        files: [
            'build/bundle.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'test/unit/**/*.js',
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'lib/**/*.js', included: false}
        ],

        exclude: [
        ],

        frameworks: ['mocha', 'chai', 'chai-as-promised', 'sinon-chai', 'browserify'],

        preprocessors: {
            'test/unit/**/*.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: ['es6ify']
        },

        browsers: ['chromenosandbox'],
        
        customLaunchers: {chromenosandbox: {base:'Chrome', flags: ['--no-sandbox']}},

        reporters: ['progress', 'coverage', 'osx'],

        coverageReporter: {
            dir: 'test/coverage',
            reporters: [
                {type: 'text'},
                {type: 'html'}
            ]
        },

        port: 9876,
        colors: true,
        autoWatch: true,
        singleRun: false,
        captureTimeout: 60000,
        logLevel: config.LOG_INFO,
        browserNoActivityTimeout: 100000
    });
};
