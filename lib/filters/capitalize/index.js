/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Capitalize
 * @module Capitalize
 */
var Capitalize = angular.module('Capitalize.Filter', []);

/**
 * Capitalize filter.
 * @module Capitalize
 * @name capitalizeFirstLetter
 * @type {Filter}
 */

Capitalize.filter('capitalizeFirstLetter', () =>
    function(input) {
        if (input) {
            input = input.toLowerCase();

            const firstLetter = input.substring(0,1).toUpperCase();
            const restOfInput = input.substring(1);
            return firstLetter + restOfInput;
        }
    });
