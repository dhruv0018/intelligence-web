/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Rolebar
 * @module Rolebar
 */
var Rolebar = angular.module('rolebar', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * Rolebar directive.
 * @module Rolebar
 * @name Rolebar
 * @type {Directive}
 */
Rolebar.directive('krossoverRolebar', [
    function directive() {

        var KrossoverRolebar = {

            restrict: TO += ELEMENTS,

            replace: true,

            templateUrl: 'lib/directives/rolebar/template.html',

        };

        return KrossoverRolebar;
    }
]);

export default Rolebar;
