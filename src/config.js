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

else {

    environment = 'production';
    config = require('../config/prod.json');
    config.oauth.uri = `https://${window.location.host}${config.oauth.uri}`;
}

config.environment = environment;

Config.constant('config', config);
