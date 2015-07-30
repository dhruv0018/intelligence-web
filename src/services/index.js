/**
 * Services
 * @module IntelligenceWebClient
 */

/* Config */

var pkg = require('../../package.json');

// Fetch angular from the browser scope

var angular = window.angular;

// Get Module

var IntelligenceWebClient = angular.module(pkg.name);


/* Define Services */

IntelligenceWebClient.service('GlyphFactory', require('./glyph-factory'));

// TODO: Define and require all other services below
require('./features/angular-index');
