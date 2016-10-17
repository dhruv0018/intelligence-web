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
FancyToggle.directive('fancyToggle', [
    function directive() {

        var FancyToggle = {

            restrict: TO += ELEMENTS,

            templateUrl: templateUrl
        };

        return FancyToggle;
    }
]);

export default FancyToggle;
