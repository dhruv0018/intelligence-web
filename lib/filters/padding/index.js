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

/**
 * Padding filter.
 * Adds spaces to the right of a string to a fixed length.
 * @module Padding
 * @name fixedLength
 * @type {filter}
 * @param {?number} fixedLength The length the string should be. Default: 5
 */
Padding.filter('padSpacesToFixedLength', [
    function() {
        return function(input, fixedLength = 5, side = 'right') {

            while (input.length <= fixedLength) {

                if (side === 'right') {

                    input = input + ' ';

                } else if (side === 'left') {

                    input = ' ' + input;
                }
            }

            return input;
        };
}]);
