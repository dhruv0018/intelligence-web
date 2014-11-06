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
                arena: '='
            },

            link: link,

            templateUrl: 'arena-placeholder.html',

        };

        /*
            Input: Men's Outdoor LAX Arena
            Output: mens-outdoor-lax-arena
         */
        function normalize(unnormalized) {
            var normalized = unnormalized.replace(/(\s)/g, '-');
            normalized = normalized.replace(/(\')/g, '');
            normalized = normalized.toLowerCase();
            return normalized;
        }

        function link($scope, element, attrs) {
            if (angular.isDefined($scope.arena)) {
                $scope.arenaName = normalize($scope.arena.name);
            } else {
                throw new Error('Arena does not exist');
            }
        }

        return arenaPlaceholder;
    }
]);
