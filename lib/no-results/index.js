/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * No-Results
 * @module No-Results
 */
var NoResults = angular.module('no-results', []);

/* Cache the template file */
NoResults.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('no-results.html', template);
    }
]);

/**
 * No-Results directive.
 * @module No-Results
 * @name No-Results
 * @type {Directive}
 */
NoResults.directive('noResults', [
    function directive() {

        var NoResults = {

            restrict: TO += ELEMENTS,

            templateUrl: 'no-results.html'
        };

        return NoResults;
    }
]);