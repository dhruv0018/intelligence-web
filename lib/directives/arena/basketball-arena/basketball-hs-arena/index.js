/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/basketball/hs/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * HS Basketball Arena
 * @module HS Basketball Arena
 */
var HSBasketballArena = angular.module('Arena.Basketball.HighSchool', []);

/* Cache the template file */
HSBasketballArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * HS Basketball Arena directive.
 * @module HS Basketball Arena
 * @name HS Basketball Arena
 * @type {Directive}
 */
HSBasketballArena.directive('basketballHsArena', [
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
