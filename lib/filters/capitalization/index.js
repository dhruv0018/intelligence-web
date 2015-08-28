/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Capitalization
 * @module Capitalization
 */
var Capitalization = angular.module('Capitalization.Filter', []);

/**
 * Capitalization filter.
 * @module Capitalization
 * @name capitalizeFirstLetter
 * @type {Filter}
 */

Capitalization.filter('capitalizeFirstLetter', () =>
    function(input) {
        if (input) {
            input = input.toLowerCase();

            const firstLetter = input.substring(0,1).toUpperCase();
            const restOfInput = input.substring(1);
            return firstLetter + restOfInput;
        }
    });
