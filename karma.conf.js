/* jshint node:true */

'use strict';

module.exports = function(config) {

    config.set({

        basePath: '',

        files: [
            'prod/*.js',
            'test/unit/**/*.js',
            {pattern: 'src/**/*.js', included: false},
            {pattern: 'lib/**/*.js', included: false}
        ],

        exclude: [

        ],

        preprocessors: {
            'src/**/*.js': ['coverage'],
            'lib/**/*.js': ['coverage']
        },

        frameworks: ['mocha', 'chai', 'chai-as-promised', 'sinon-chai'],

        browsers: ['PhantomJS'],

        reporters: ['progress', 'coverage'],

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
        logLevel: config.LOG_INFO
    });
};
