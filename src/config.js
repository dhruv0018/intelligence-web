var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var Config = angular.module('config', []);

Config.constant('pkg', pkg);

var config;

var environment = process.env.NODE_ENV;

if (environment === 'development') {

    config = require('../config/dev.json');
}

else if (environment === 'qa') {

    config = require('../config/qa.json');
}

else if (environment === 'production') {

    config = require('../config/prod.json');
}

config.environment = environment;

Config.constant('config', config);

