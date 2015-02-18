/* Component resources */
var template = require('./template.html');

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

/* Cache the template file */
Rolebar.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('rolebar.html', template);
    }
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

            templateUrl: 'rolebar.html',

        };

        return KrossoverRolebar;
    }
]);

