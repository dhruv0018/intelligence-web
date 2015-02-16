
/**
 * Entities
 * @module IntelligenceWebClient
 */

/* Config */

var pkg = require('../../../package.json');

// Fetch angular from the browser scope

var angular = window.angular;

// Get Module

var IntelligenceWebClient = angular.module(pkg.name);

/* Define Entities */

IntelligenceWebClient.factory('GlyphEntity', require('./glyph-entity'));
IntelligenceWebClient.factory('TelestrationEntity', require('./telestration-entity'));
