/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Normalize
 * @module Normalize
 */
var Normalize = angular.module('Normalize.Filter', []);

/**
 * Normalize filter.
 * @module Normalize
 * @name Normalize
 * @type {Filter}
 */

/* This filter is utilized by the arena and sport placeholder directives to transform back-end
    data values into usable CSS class names */

Normalize.filter('normalize', [
    function() {

        return function(unnormalized) {

            var normalized = '';

            if (angular.isDefined(unnormalized)) {
                normalized = unnormalized.replace(/(\s)/g, '-'); // Replace ALL spaces with underscores
                normalized = normalized.replace(/(\')/g, ''); // Remove ALL apostrophes
                normalized = normalized.toLowerCase();
            }
            return normalized;
        };
    }
]);

export default Normalize;
