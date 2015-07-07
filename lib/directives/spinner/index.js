/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'spinner.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Spinner
 * @module Spinner
 */
var Spinner = angular.module('Spinner', []);

/* Cache the template file */
Spinner.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * spinner directive.
 * @module spinner
 * @name spinner
 * @type {directive}
 */
Spinner.directive('krossoverSpinner', [
    function directive() {

        var Spinner = {

            restrict: TO += ELEMENTS,

            scope: {

                size: '@'
            },

            templateUrl: templateUrl
        };

        return Spinner;
    }
]);
