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
