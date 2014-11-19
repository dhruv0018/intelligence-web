/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Arena Placeholder
 * @module Arena Placeholder
 */
var arenaPlaceholder = angular.module('arena-placeholder', []);

/* Cache the template file */
arenaPlaceholder.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('arena-placeholder.html', template);
    }
]);

/**
 * arena Placeholder directive.
 * @module arena Placeholder
 * @name arena Placeholder
 * @type {Directive}
 */
arenaPlaceholder.directive('arenaPlaceholder', ['ARENA_TYPES',

    function directive(ARENA_TYPES) {

        var arenaPlaceholder = {

            restrict: TO += ELEMENTS,

            scope: {
                league: '='
            },

            link: link,

            templateUrl: 'arena-placeholder.html',

        };

        function link($scope, element, attrs) {
            var arenaId = $scope.league.arenaId;
            $scope.arenaSVG = ARENA_TYPES[arenaId].svg;
        }

        return arenaPlaceholder;
    }
]);
