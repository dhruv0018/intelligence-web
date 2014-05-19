/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Sport Placeholder
 * @module Sport Placeholder
 */
var sportPlaceholder = angular.module('sport-placeholder', []);

/* Cache the template file */
sportPlaceholder.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('sport-placeholder.html', template);
    }
]);

/**
 * Sport Placeholder directive.
 * @module Sport Placeholder
 * @name Sport Placeholder
 * @type {Directive}
 */
sportPlaceholder.directive('sportPlaceholder', [

    function directive() {

        var sportplaceholder = {

            restrict: TO += ELEMENTS,

            scope: {
                sport: '='
            },

            templateUrl: 'sport-placeholder.html',

        };

        return sportplaceholder;
    }
]);

