
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


/* Require Complex Entities */

require('./telestration-entity');


/* Define Entities */

IntelligenceWebClient.value('ArrayEntity', require('./array-entity'));
IntelligenceWebClient.factory('GlyphEntity', require('./glyph-entity'));
