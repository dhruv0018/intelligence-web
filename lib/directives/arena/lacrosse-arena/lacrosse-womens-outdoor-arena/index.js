/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/lacrosse/womens-outdoor/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Women's Outdoor Lacrosse Arena
 * @module Women's Outdoor Lacrosse Arena
 */
var WomensOutdoorLacrosseArena = angular.module('Arena.Lacrosse.WomensOutdoor', []);

/* Cache the template file */
WomensOutdoorLacrosseArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Women's Outdoor Lacrosse Arena directive.
 * @module Women's Outdoor Lacrosse Arena
 * @name Women's Outdoor Lacrosse Arena
 * @type {Directive}
 */
WomensOutdoorLacrosseArena.directive('lacrosseWomensOutdoorArena', [
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

            const regionsConstant = Object.assign({}, ARENA_REGIONS.LACROSSE);

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
