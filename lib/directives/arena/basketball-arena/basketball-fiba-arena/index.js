/* Constants */
var TO = '';
var ELEMENTS = 'E';

const templateUrl = 'lib/directives/arena/basketball-arena/basketball-fiba-arena/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FIBA Basketball Arena
 * @module FIBA Basketball Arena
 */
var FIBABasketballArena = angular.module('Arena.Basketball.FIBA', []);

/**
 * FIBA Basketball Arena directive.
 * @module FIBA Basketball Arena
 * @name FIBA Basketball Arena
 * @type {Directive}
 */
FIBABasketballArena.directive('basketballFibaArena', [
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

export default FIBABasketballArena;
