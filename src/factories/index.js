
/**
 * Aggregate Factories
 * @module IntelligenceWebClient
 */

/* Config */

var pkg = require('../../package.json');

// Fetch angular from the browser scope

var angular = window.angular;

// Get Module

var IntelligenceWebClient = angular.module(pkg.name);

// Require Entities & Values

require('./entities');
require('./values');


/* Define Factories */

// TODO: Define and require all other Aggregate factories here
