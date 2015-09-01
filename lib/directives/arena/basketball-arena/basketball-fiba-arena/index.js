/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/basketball/fiba/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FIBA Basketball Arena
 * @module FIBA Basketball Arena
 */
var FIBABasketballArena = angular.module('Arena.Basketball.FIBA', []);

/* Cache the template file */
FIBABasketballArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * FIBA Basketball Arena directive.
 * @module FIBA Basketball Arena
 * @name FIBA Basketball Arena
 * @type {Directive}
 */
FIBABasketballArena.directive('basketballFibaArena', [
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
