/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Filters module.
 * @module Filters
 */
var Filters = angular.module('Filters', [
    'Sport.Filter'
]);

require('sport');

