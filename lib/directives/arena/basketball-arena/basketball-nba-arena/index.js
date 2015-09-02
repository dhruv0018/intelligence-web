/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/basketball/nba/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * NBA Basketball Arena
 * @module NBA Basketball Arena
 */
var NBABasketballArena = angular.module('Arena.Basketball.NBA', []);

/* Cache the template file */
NBABasketballArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * NBA Basketball Arena directive.
 * @module NBA Basketball Arena
 * @name NBA Basketball Arena
 * @type {Directive}
 */
NBABasketballArena.directive('basketballNbaArena', [
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

            arenaController.bindClickListeners(element[0], regionsConstant, updateRegion);

            function updateRegion(regionKey) {

                scope.$apply(() => {

                    scope.region.id = regionsConstant[regionKey].id;
                });
            }
        }

        return Arena;
    }
]);
