/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/basketball/ncaa/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * NCAA Basketball Arena
 * @module NCAA Basketball Arena
 */
var NCAABasketballArena = angular.module('Arena.Basketball.NCAA', []);

/* Cache the template file */
NCAABasketballArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * NCAA Basketball Arena directive.
 * @module NCAA Basketball Arena
 * @name NCAA Basketball Arena
 * @type {Directive}
 */
NCAABasketballArena.directive('basketballNcaaArena', [
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
