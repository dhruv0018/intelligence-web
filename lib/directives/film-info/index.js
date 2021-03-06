/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Film Info
 * @module Film Info
 */
var filmInfo = angular.module('film-info', []);

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

            templateUrl: 'lib/directives/film-info/template.html',

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
            $scope.teams = teams.getCollection();

            /* Logic for game score data */
            const updateGameScore = () => {
                $scope.homeTeamScore = $scope.film.getHomeTeamScore();
                $scope.opposingTeamScore = $scope.film.getAwayTeamScore();
                $scope.gameScoresExist = $scope.film.doGameScoresExist();
                $scope.homeWon = $scope.film.didHomeWin();
                $scope.opponentWon = $scope.film.didOpponentWin();
            };

            if ($scope.isGame) {
                /* Logic for game team name data */

                $scope.homeTeamName = $scope.film.getHomeTeamName();
                $scope.opposingTeamName = $scope.film.getAwayTeamName();
                updateGameScore();

                /* A watch here is necessary because the film home was experiencing synchronicity
                   issues with calculating data in the linking function after the template has been
                   rendered. Logic for the team names were placed in a forgiving template, while data
                   for the game scores updates via logic in this watch */

                $scope.$watch('film.finalScore', updateGameScore);
                $scope.$watch('film.opposingFinalScore', updateGameScore);
                $scope.$watch('film.indexedScore', updateGameScore);
                $scope.$watch('film.opposingIndexedScore', updateGameScore);
            }

            /* For editing a reel name */

            $scope.editingReelTitle = false;
            $scope.newReelName = $scope.film.name;

            $scope.changeReelName = (name) => {
                $scope.film.name = name;
                $scope.film.updateDate();
                $scope.film.save();
            };

            $scope.toggleEditingReelTitle = () => {
                $scope.editingReelTitle = !$scope.editingReelTitle;
            };

            $scope.cancelEditReelName = () => {
                $scope.newReelName = $scope.film.name;
                $scope.toggleEditingReelTitle();
            };

            $scope.saveReelName = (name) => {
                $scope.toggleEditingReelTitle();
                $scope.changeReelName(name);
            };
        }

        return filmInfo;
    }
]);

export default filmInfo;
