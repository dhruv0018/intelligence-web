
/**
 * Values
 * @module IntelligenceWebClient
 */

/* Config */

var pkg = require('../../../package.json');

// Fetch angular from the browser scope

var angular = window.angular;

// Get Module

var IntelligenceWebClient = angular.module(pkg.name);

// Require Complex Values

require('./glyph');


/* Define Values */

// TODO: Define and require all other Values here

// IntelligenceWebClient.factory('TelestrationValue', require('./telestration-value');
// IntelligenceWebClient.factory('GlyphValue', require('./glyph-value');
