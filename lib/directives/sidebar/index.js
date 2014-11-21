/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'sidebar.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Sidebar
 * @module Sidebar
 */
var Sidebar = angular.module('Sidebar', [
    'ui.bootstrap'
]);

/* Cache the template file */
Sidebar.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Sidebar directive.
 * @module Sidebar
 * @name Sidebar
 * @type {directive}
 */
Sidebar.directive('krossoverSidebar', [
    function directive() {

        var Sidebar = {

            restrict: TO += ELEMENTS,

            replace: true,

            templateUrl: templateUrl,

            transclude: true
        };

        return Sidebar;
    }
]);
