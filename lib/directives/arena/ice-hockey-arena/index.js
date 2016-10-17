/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'lib/directives/arena/ice-hockey-arena/template.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * IceHockey Arena
 * @module IceHockey Arena
 */
const IceHockeyArena = angular.module('Arena.IceHockey', []);

/**
 * IceHockey Arena directive.
 * @module IceHockey Arena
 * @name IceHockey Arena
 * @type {Directive}
 */
IceHockeyArena.directive('iceHockeyArena', [
    'ARENA_REGIONS',
    function directive(ARENA_REGIONS) {

        const definition = {

            restrict: TO += ELEMENTS,

            scope: {
                region: '=ngModel'
            },

            link,

            require: '^krossoverArena',

            templateUrl
        };

        function link(scope, element, attributes, arenaController) {

            const regionsConstant = Object.assign({}, ARENA_REGIONS.ICE_HOCKEY);

            arenaController.bindClickListeners(element[0], regionsConstant, scope);
        }

        return definition;
    }
]);

export default IceHockeyArena;
