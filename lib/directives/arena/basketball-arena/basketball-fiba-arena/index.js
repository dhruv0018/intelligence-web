/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/basketball/fiba/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FIBA Basketball Arena
 * @module FIBA Basketball Arena
 */
var FIBABasketballArena = angular.module('Arena.Basketball.FIBA', []);

/* Cache the template file */
FIBABasketballArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

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
