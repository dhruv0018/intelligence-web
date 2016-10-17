/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/basketball-arena/basketball-hs-arena/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * HS Basketball Arena
 * @module HS Basketball Arena
 */
var HSBasketballArena = angular.module('Arena.Basketball.HighSchool', []);

/**
 * HS Basketball Arena directive.
 * @module HS Basketball Arena
 * @name HS Basketball Arena
 * @type {Directive}
 */
HSBasketballArena.directive('basketballHsArena', [
    'ARENA_REGIONS',
    function directive(
        ARENA_REGIONS
    ) {

        var Arena = {

            restrict: TO += ELEMENTS,

            link,

            require: '^krossoverArena',

            templateUrl
        };

        function link(scope, element, attributes, arenaController) {

            const regionsConstant = Object.assign({}, ARENA_REGIONS.BASKETBALL);

            arenaController.bindClickListeners(element[0], regionsConstant, scope);
        }

        return Arena;
    }
]);

export default HSBasketballArena;
