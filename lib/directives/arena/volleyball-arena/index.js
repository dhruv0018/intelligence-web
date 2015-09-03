/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'arena/volleyball/template.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Volleyball Arena
 * @module Volleyball Arena
 */
var VolleyballArena = angular.module('Arena.Volleyball', []);

/* Cache the template file */
VolleyballArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Volleyball Arena directive.
 * @module Volleyball Arena
 * @name Volleyball Arena
 * @type {Directive}
 */
VolleyballArena.directive('volleyballArena', [
    'ARENA_REGIONS',
    function directive(
        ARENA_REGIONS
    ) {

        var VolleyballArena = {

            restrict: TO += ELEMENTS,

            scope: {
                region: '=ngModel'
            },

            link: link,

            require: '^krossoverArena',

            templateUrl: templateUrl
        };

        function link(scope, element, attributes, arenaController) {

            const regionsConstant = Object.assign({}, ARENA_REGIONS.VOLLEYBALL);

            arenaController.bindClickListeners(element[0], regionsConstant, scope);
        }

        return VolleyballArena;
    }
]);
