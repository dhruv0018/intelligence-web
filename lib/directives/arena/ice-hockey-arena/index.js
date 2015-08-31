/* Constants */
let TO = '';
const ELEMENTS = 'E';

const templateUrl = 'arena/ice-hockey/template.html';

/* Component resources */
const template = require('./template.html');

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * IceHockey Arena
 * @module IceHockey Arena
 */
const IceHockeyArena = angular.module('Arena.IceHockey', []);

/* Cache the template file */
IceHockeyArena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

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

            templateUrl
        };

        function link($scope, element, attributes) {

        }

        return definition;
    }
]);
