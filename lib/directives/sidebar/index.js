/* Constants */
let TO = '';
const ELEMENTS = 'E';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Sidebar
 * @module Sidebar
 */
const Sidebar = angular.module('Sidebar', [
    'ui.bootstrap'
]);

/**
 * Sidebar directive.
 * @module Sidebar
 * @name Sidebar
 * @type {directive}
 */
Sidebar.directive('krossoverSidebar', [
    function directive() {

        const Sidebar = {

            restrict: TO += ELEMENTS,

            replace: true,

            templateUrl: 'lib/directives/sidebar/template.html',

            transclude: true
        };

        return Sidebar;
    }
]);

export default Sidebar;
