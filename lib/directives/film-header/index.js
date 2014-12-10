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
    'TeamsFactory', 'GAME_TYPES_IDS', 'GAME_TYPES',
    function directive(teams, GAME_TYPES_IDS, GAME_TYPES) {

        var filmHeader = {

            restrict: TO += ELEMENTS,

            scope: {
                'play': '=?',
                'film': '=',
                'gameStates': '=?'
            },

            link: link,

            templateUrl: 'film-header.html',

        };

        function link($scope, element, attrs) {

            /* State Booleans */

            if (angular.isDefined($scope.film)) $scope.isGame = $scope.film.description === 'games';
            if (angular.isDefined($scope.film)) $scope.isReel = $scope.film.description === 'reels';
            if (angular.isDefined($scope.play)) $scope.isClip = $scope.play.description === 'plays';

            /* Logic for film title */

            $scope.filmTitle = 'Other';

            if ($scope.isClip) {
                $scope.filmTitle = 'Clip';
            } else if ($scope.isReel) {
                $scope.filmTitle = 'Reel';
            } else if ($scope.isGame) {
                var gameTypeId = GAME_TYPES_IDS[$scope.film.gameType];
                var gameType = GAME_TYPES[gameTypeId];
                $scope.filmTitle = gameType.name;
            }
        }

        return filmHeader;
    }
]);
