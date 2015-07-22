var pkg = require('../../../package.json');

import Features from './index';

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * A service to help determine if a feature is enabled/disabled based on a
 * wildcard or the current user type.
 * @module IntelligenceWebClient
 * @name Features
 * @type {service}
 */

Features.$inject = [
    'SessionService',
    'FEATURES',
    '$location'
];

IntelligenceWebClient.service('Features', Features);
