
/**
 * Telestration Value
 * @module IntelligenceWebClient
 */

/* Config */

var pkg = require('../../../../package.json');

// Fetch angular from the browser scope

var angular = window.angular;

// Get Module
// TODO: Make Telestration it's own module

var IntelligenceWebClient = angular.module(pkg.name);


/* Define Factories */

IntelligenceWebClient.factory('TelestrationValue', require('./telestration'));
IntelligenceWebClient.factory('RawTelestrationValue', require('./raw-telestration'));
IntelligenceWebClient.factory('PlayTelestrationValue', require('./play-telestration'));


/* Constants */
