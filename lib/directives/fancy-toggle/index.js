/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/fancy-toggle/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FancyToggle
 * @module FancyToggle
 */
var FancyToggle = angular.module('FancyToggle', []);

/**
 * fancyToggle directive.
 * @module FancyToggle
 * @name fancyToggle
 * @type {directive}
 */

// TODO: Note that this currently displays as checked with a false value and
// unchecked with a true value. That's because it was initially created to
// show nonsuspended teams as green and suspended ones as gray.

FancyToggle.directive('fancyToggle', [
    function directive() {

        var FancyToggle = {

            restrict: TO += ELEMENTS,

            templateUrl: templateUrl,

            scope: {
                model: '='
            }
        };

        return FancyToggle;
    }
]);

export default FancyToggle;
