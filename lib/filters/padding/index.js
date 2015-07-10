/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Padding
 * @module Padding
 */
var Padding = angular.module('Padding.Filter', []);

/**
 * Padding filter.
 * generic wrapper around utilities padding functionality
 * @module Padding
 * @name padZero
 * @type {filter}
 */
Padding.filter('padZero', [
    'Utilities',
    function(utilities) {
        return function(input) {
            return utilities.padZero(input);
        };
}]);
