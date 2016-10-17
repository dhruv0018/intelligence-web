/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/basketball-arena/basketball-v1-arena/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * V1 Basketball Arena
 * @module V1 Basketball Arena
 */
var V1BasketballArena = angular.module('Arena.Basketball.V1', []);

/**
 * V1 Basketball Arena directive.
 * @module V1 Basketball Arena
 * @name V1 Basketball Arena
 * @type {Directive}
 */
V1BasketballArena.directive('basketballV1Arena', [
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

            const regionsConstant = Object.assign({}, ARENA_REGIONS.BASKETBALL_V1);

            arenaController.bindClickListeners(element[0], regionsConstant, scope);
        }

        return Arena;
    }
]);

export default V1BasketballArena;
