/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Mascot Placeholder
 * @module Mascot Placeholder
 */
var mascotPlaceholder = angular.module('mascot-placeholder', []);


/**
 * Mascot Placeholder directive.
 * @module Mascot Placeholder
 * @name Mascot Placeholder
 * @type {Directive}
 */
mascotPlaceholder.directive('mascotPlaceholder', [
    function directive() {

        var mascotplaceholder = {

            restrict: TO += ELEMENTS,

            templateUrl: 'lib/directives/mascot-placeholder/template.html'
        };

        return mascotplaceholder;
    }
]);

export default mascotPlaceholder;
