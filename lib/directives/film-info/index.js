/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Film Info
 * @module Film Info
 */
var filmInfo = angular.module('film-info', []);

/* Cache the template file */
filmInfo.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('film-info.html', template);
    }
]);

/**
 * Film Info directive.
 * @module Film Info
 * @name Film Info
 * @type {Directive}
 */
filmInfo.directive('filmInfo', [
    'TeamsFactory',
    function directive(teams) {

        var filmInfo = {

            restrict: TO += ELEMENTS,

            scope: {
                'filmTitle': '=',
                'film': '=',
                'isEditable': '=?'
            },

            link: link,

            templateUrl: 'film-info.html',

        };

        function link($scope, element, attrs) {

            $scope.isGame = false;
            $scope.isReel = false;
            $scope.isPlay = false;

            switch ($scope.film.description) {
                case 'games':
                    $scope.isGame = true;
                    break;
                case 'reels':
                    $scope.isReel = true;
                    break;
                case 'plays':
                    $scope.isPlay = true;
            }

            /* If isEditable is not passed in, set it to false */

            $scope.isEditable = $scope.isEditable || false;

            /* Logic for team name data */

            $scope.teams = teams.getCollection();

            /* Logic for game score data */

            /* A watch here is necessary because the film home was experiencing synchronicity
               issues with calculating data in the linking function after the template has been
               rendered. Logic for the team names were placed in a forgiving template, while data
               for the game scores updates via logic in this watch */

            $scope.$watch('film.finalScore', updateGameScore);
            $scope.$watch('film.opposingFinalScore', updateGameScore);
            $scope.$watch('film.indexedScore', updateGameScore);
            $scope.$watch('film.opposingIndexedScore', updateGameScore);

            function updateGameScore(newVal, oldVal) {

                var inputtedGameScoresUnavailable = ($scope.film.finalScore === 0) && ($scope.film.opposingFinalScore === 0);
                var indexedGameScoresAvailable = angular.isDefined($scope.film.indexedScore) && angular.isDefined($scope.film.opposingIndexedScore);

                $scope.homeTeamScore = $scope.film.finalScore;
                $scope.opposingTeamScore = $scope.film.opposingFinalScore;

                if (inputtedGameScoresUnavailable && indexedGameScoresAvailable) {
                    $scope.homeTeamScore = $scope.film.indexedScore;
                    $scope.opposingTeamScore = $scope.film.opposingIndexedScore;
                }

                $scope.gameScoresExist = !inputtedGameScoresUnavailable || indexedGameScoresAvailable;

                /* Logic for CSS class toggle */

                if (!$scope.gameScoresExist || $scope.homeTeamScore === $scope.opposingTeamScore) {
                    // Hides both scores
                    $scope.homeWon = false;
                    $scope.opponentWon = false;
                } else {
                    $scope.homeWon = $scope.homeTeamScore > $scope.opposingTeamScore;
                    $scope.opponentWon = !$scope.homeWon;
                }
            }

            /* For editing a reel name */

            $scope.editingReelTitle = false;
            $scope.newReelName = $scope.film.name;

            $scope.changeReelName = function(name) {
                $scope.film.name = name;
                $scope.film.updateDate();
                $scope.film.save();
            };
        }

        return filmInfo;
    }
]);
