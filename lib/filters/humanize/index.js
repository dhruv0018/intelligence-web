/* Fetch angular from the browser scope */
var angular = window.angular;

var moment = require('moment');

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

        return function(inputDate, unitTimeIsExpressedAs, suffix) {
            if (inputDate === 0) {
                return '';
            }

            return moment.duration(inputDate, unitTimeIsExpressedAs).humanize(suffix);
        };
    }
]);

export default Humanize;
