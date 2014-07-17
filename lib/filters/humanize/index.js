/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Humanize
 * @module Humanize
 */
var Humanize = angular.module('Humanize.Filter', []);

/**
 * Humanize filter.
 * @module Humanize
 * @name Humanize
 * @type {Filter}
 */
Humanize.filter('humanize', [
    function() {

        return function(inputDate) {
            console.log(dateInput);
        };
    }
]);

