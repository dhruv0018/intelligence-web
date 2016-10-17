/* Component dependencies */
import BasketballArena from './basketball-arena/index.js';
import FootballArena from './football-arena/index.js';
import IceHockeyArena from './ice-hockey-arena/index.js';
import LacrosseArena from './lacrosse-arena/index.js';
import VolleyballArena from './volleyball-arena/index.js';
import SoccerArena from './soccer-arena/index.js';

/* Constants */
let TO = '';
let ELEMENTS = 'E';

const templateUrl = 'lib/directives/arena/template.html';

import arenaController from './controller';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Arena
 * @module Arena
 */
const Arena = angular.module('Arena', [
    'ui.router',
    'ui.bootstrap',
    'Arena.Football',
    'Arena.Basketball',
    'Arena.Lacrosse',
    'Arena.Volleyball',
    'Arena.IceHockey',
    'Arena.Soccer'
]);

/**
 * Arena directive.
 * @module Arena
 * @name Arena
 * @type {Directive}
 */
Arena.directive('krossoverArena', [
    function directive() {

        const Arena = {

            restrict: TO += ELEMENTS,

            scope: {
                type: '=',
                region: '=?ngModel',
                chart: '=?',
                redzone: '=?',
                plays: '=?',
                highlightRegions: '=?',
                game: '=?'
            },

            templateUrl,

            controller: arenaController,

            transclude: true
        };

        return Arena;
    }
]);

export default Arena;
