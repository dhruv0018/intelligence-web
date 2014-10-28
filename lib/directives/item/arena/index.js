/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'item/arena.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Arena
 * @module Arena
 */
var Arena = angular.module('Item.Arena', []);

/* Cache the template file */
Arena.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Arena directive.
 * @module Arena
 * @name Arena
 * @type {Directive}
 */
Arena.directive('krossoverItemArena', ['ArenaModal.Modal',

    function directive(ArenaModal) {

        var Arena = {

            restrict: TO += ELEMENTS,

            scope: {

            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {
            $scope.ArenaModal = ArenaModal;
            $scope.options = {scope: $scope};

            $scope.coordinates = {};

            $scope.$watch('coordinates', function(oldCoords, newCoords) {
                console.log(newCoords);
            });
        }

        return Arena;
    }
]);

