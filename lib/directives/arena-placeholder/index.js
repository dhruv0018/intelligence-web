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
arenaPlaceholder.directive('arenaPlaceholder', [

    function directive() {

        var arenaPlaceholder = {

            restrict: TO += ELEMENTS,

            scope: {
                arena: '@'
            },

            link: link,

            templateUrl: 'arena-placeholder.html',

        };

        /*
            Input: Basketball NBA
            Output: arena-basketball-nba
         */
        function normalize(unNormalized) {
            var normalized = unNormalized.toLowerCase();
            normalized.replace('\'', '');
            // TO-DO: Will this remove all apostrophes?
            normalized.replace(' ', '-');

            return normalized;
        }

        function link($scope, element, attrs) {
            // $scope.arenaName = normalize($scope.arena.name);
        }

        return arenaPlaceholder;
    }
]);
