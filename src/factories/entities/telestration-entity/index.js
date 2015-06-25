
/**
 * Telestration Entity
 * @module IntelligenceWebClient
 */

/* Config */

var pkg = require('../../../../package.json');

// Fetch angular from the browser scope

var angular = window.angular;

// Get Module

var IntelligenceWebClient = angular.module(pkg.name);

/* Define Entities */

IntelligenceWebClient.factory('TelestrationEntity', require('./telestration-entity'));
IntelligenceWebClient.factory('RawTelestrationEntity', require('./raw-telestration-entity'));
IntelligenceWebClient.factory('PlayTelestrationEntity', require('./play-telestration-entity'));
IntelligenceWebClient.factory('ReelTelestrationEntity', require('./reel-telestration-entity'));
