var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var Config = angular.module('config', []);

Config.constant('pkg', pkg);

var config;

var environment = process.env.NODE_ENV;

if (environment === 'test') {

    config = require('../config/test.json');
}

else if (environment === 'development') {

    config = require('../config/dev.json');
}

else if (environment === 'qa') {

    config = require('../config/qa.json');
}

else if (environment === 'uat') {

    config = require('../config/uat.json');
}

else if (environment === 'buildserver') {

    environment = 'production';
    config = require('../config/prod.json');
    config.oauth.uri = 'http://' + process.env.BUILDSERVER + '.v2.krossover.com/intelligence-api/oauth/';
    config.api.uri = 'http://' + process.env.BUILDSERVER + '.v2.krossover.com/intelligence-api/v1/';
    config.apiV2.uri = 'http://' + process.env.BUILDSERVER + '.v2.krossover.com/intelligence-api/v2/';
    config.apiV3.uri = 'http://' + process.env.BUILDSERVER + '.v2.krossover.com/intelligence-api/v3/';
}

else {

    environment = 'production';
    config = require('../config/prod.json');
    config.oauth.uri = `https://${window.location.host}${config.oauth.uri}`;
    config.api.uri = `https://${window.location.host}${config.api.uri}`;
    config.apiV2.uri = `https://${window.location.host}${config.apiV2.uri}`;
    config.apiV3.uri = `https://${window.location.host}${config.apiV3.uri}`;
}

config.environment = environment;

Config.constant('config', config);
