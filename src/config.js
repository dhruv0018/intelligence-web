var package = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var pkg = require('../package.json');
var dev = require('../config/dev.json');
var qa = require('../config/qa.json');
var prod = require('../config/prod.json');

var Config = angular.module('config', []);

Config.constant('package', package);

if (process.env.NODE_ENV === 'development') {

    Config.constant('config', dev);
}

if (process.env.NODE_ENV === 'qa') {

    Config.constant('config', qa);
}

if (process.env.NODE_ENV === 'production') {

    Config.constant('config', prod);
}

