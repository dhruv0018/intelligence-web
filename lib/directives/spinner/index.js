/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Spinner
 * @module Spinner
 */
const Spinner = angular.module('Spinner', []);

/**
 * spinner directive.
 * @module spinner
 * @name spinner
 * @type {directive}
 */
Spinner.directive('krossoverSpinner', [
    function directive() {

        const Spinner = {

            restrict: TO += ELEMENTS,

            scope: {

                size: '@'
            },

            templateUrl: 'lib/directives/spinner/template.html'
        };

        return Spinner;
    }
]);

export default Spinner;
