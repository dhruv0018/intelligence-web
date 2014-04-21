/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Mascot Placeholder
 * @module Mascot Placeholder
 */
var mascotPlaceholder = angular.module('mascot-placeholder', []);

/* Cache the template file */
mascotPlaceholder.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('mascot-placeholder.html', template);
    }
]);

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

            templateUrl: 'mascot-placeholder.html'
        };

        return mascotplaceholder;
    }
]);

