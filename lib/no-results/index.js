/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * No-Results
 * @module No-Results
 */
var Plan = angular.module('no-results', []);

/* Cache the template file */
Plan.run([
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
Plan.directive('noResults', [
    function directive() {

        var plan = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            templateUrl: 'no-results.html'
        };

        return plan;
    }
]);