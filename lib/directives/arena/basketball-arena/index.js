/* Component dependencies */
import FIBABasketballArena from './basketball-fiba-arena/index.js';
import HSBasketballArena from './basketball-hs-arena/index.js';
import NBABasketballArena from './basketball-nba-arena/index.js';
import NCAABasketballArena from './basketball-ncaa-arena/index.js';
import V1BasketballArena from './basketball-v1-arena/index.js';

import BasketballArenaController from './controller';

/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/arena/basketball-arena/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Basketball Arena
 * @module Basketball Arena
 */
var BasketballArena = angular.module('Arena.Basketball', [
    'ui.router',
    'ui.bootstrap',
    'Arena.Basketball.HighSchool',
    'Arena.Basketball.NCAA',
    'Arena.Basketball.NBA',
    'Arena.Basketball.FIBA',
    'Arena.Basketball.V1'
]);

/**
 * Basketball Arena directive.
 * @module Basketball Arena
 * @name Basketball Arena
 * @type {Directive}
 */
BasketballArena.directive('basketballArena', [
    'ARENA_REGIONS',
    function directive(ARENA_REGIONS) {

        var BasketballArena = {

            restrict: TO += ELEMENTS,

            scope: {
                region: '=?ngModel',
                type: '=',
                game: '=?'
            },

            controller: BasketballArenaController,

            templateUrl
        };

        return BasketballArena;
    }
]);

BasketballArena.controller('Arena.Basketball.Controller', BasketballArenaController);

export default BasketballArena;
