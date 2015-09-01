/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/lacrosse/mens-outdoor/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Men's Outdoor Lacrosse Arena
 * @module Men's Outdoor Lacrosse Arena
 */
var MensOutdoorLacrosseArena = angular.module('Arena.Lacrosse.MensOutdoor', []);

/* Cache the template file */
MensOutdoorLacrosseArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Men's Outdoor Lacrosse Arena directive.
 * @module Men's Outdoor Lacrosse Arena
 * @name Men's Outdoor Lacrosse Arena
 * @type {Directive}
 */
MensOutdoorLacrosseArena.directive('lacrosseMensOutdoorArena', [
    function directive() {

        var Arena = {

            restrict: TO += ELEMENTS,

            link,

            templateUrl
        };

        function link(scope, element, attributes) {

            (scope.$parent.addEventListeners)(element[0]);
        }

        return Arena;
    }
]);
