
/**
 * Shape Value
 * @module IntelligenceWebClient
 */

/* Config */

var pkg = require('../../../../package.json');

// Fetch angular from the browser scope

var angular = window.angular;

// Get Module

// TODO: Make Shape it's own module

var IntelligenceWebClient = angular.module(pkg.name);


/* Define Factories */

IntelligenceWebClient.factory('GlyphValue', require('./glyph'));
IntelligenceWebClient.factory('SVGGlyphValue', require('./svg-glyph'));
IntelligenceWebClient.factory('SpotlightValue', require('./spotlight'));
IntelligenceWebClient.factory('ArrowValue', require('./arrow'));
IntelligenceWebClient.factory('ConeSpotlightValue', require('./cone-spotlight'));
IntelligenceWebClient.factory('CircleValue', require('./circle'));
IntelligenceWebClient.factory('FreehandValue', require('./freehand'));
IntelligenceWebClient.factory('CircleSpotlightValue', require('./circle-spotlight'));
IntelligenceWebClient.factory('TBarValue', require('./tbar'));
IntelligenceWebClient.factory('TextValue', require('./text'));
