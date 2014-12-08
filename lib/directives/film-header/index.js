/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Film Header
 * @module Film Header
 */
var filmHeader = angular.module('film-header', []);

/* Cache the template file */
filmHeader.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('film-header.html', template);
    }
]);

/**
 * Film Header directive.
 * @module Film Header
 * @name Film Header
 * @type {Directive}
 */
filmHeader.directive('filmHeader', [

    'TeamsFactory',
    function directive(teams) {

        var filmHeader = {

            restrict: TO += ELEMENTS,

            scope: {
                'title': '=',
                'film': '=',
                'gameStates': '=?'
            },

            link: link,

            templateUrl: 'film-header.html',

        };

        function link($scope, element, attrs) {

            /* Logic for film title */

            switch ($scope.title) {
                case 'games':
                    $scope.filmTitle = 'Raw Film';
                    break;
                case 'plays':
                    $scope.filmTitle = 'Clip';
                    break;
                default:
                    $scope.filmTitle = 'Other';
            }
        }

        return filmHeader;
    }
]);
