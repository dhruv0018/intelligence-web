/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * No-Results
 * @module No-Results
 */
var NoResults = angular.module('no-results', []);

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

            templateUrl: 'lib/directives/no-results/template.html'
        };

        return NoResults;
    }
]);

export default NoResults;
