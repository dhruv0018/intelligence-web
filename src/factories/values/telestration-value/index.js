
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

IntelligenceWebClient.factory('ExtendTelestrationValue', require('./extend-telestration-value'));
IntelligenceWebClient.factory('TelestrationValue', require('./telestration-value'));
IntelligenceWebClient.factory('PlayTelestrationValue', require('./play-telestration-value'));
IntelligenceWebClient.factory('RawTelestrationValue', require('./raw-telestration-value'));
IntelligenceWebClient.factory('ReelTelestrationValue', require('./reel-telestration-value'));


/* Constants */
