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
                'title': '=',
                'film': '='
            },

            link: link,

            templateUrl: 'film-info.html',

        };

        function link($scope, element, attrs) {

            $scope.isGame = false;
            $scope.isReel = false;

            switch ($scope.film.description) {
                case 'games':
                    $scope.isGame = true;
                    break;
                case 'reels':
                    $scope.isReel = true;
                    break;
            }

            /* Logic for team name data */

            var homeTeamExists = angular.isDefined($scope.film.teamId);
            var opposingTeamExists = angular.isDefined($scope.film.opposingTeamId);

            $scope.homeTeamName = homeTeamExists ? teams.get($scope.film.teamId).name : 'Home';
            $scope.opposingTeamName = opposingTeamExists ? teams.get($scope.film.opposingTeamId).name : 'Away';

            $scope.teamsExist = homeTeamExists || opposingTeamExists;

            /* Logic for game score data */

            var inputtedGameScoresUnavailable = ($scope.film.finalScore === 0) && ($scope.film.opposingFinalScore === 0);
            var indexedGameScoresAvailable = angular.isDefined($scope.film.indexedScore) && angular.isDefined($scope.film.opposingIndexedScore);

            $scope.homeTeamScore = $scope.film.finalScore;
            $scope.opposingTeamScore = $scope.film.opposingFinalScore;

            if (inputtedGameScoresUnavailable && indexedGameScoresAvailable) {
                $scope.homeTeamScore = $scope.film.indexedScore;
                $scope.opposingTeamScore = $scope.film.opposingIndexedScore;
            }

            $scope.gameScoresExist = !inputtedGameScoresUnavailable || indexedGameScoresAvailable;

            // Logic for CSS class toggle

            if (!$scope.gameScoresExist || $scope.homeTeamScore === $scope.opposingTeamScore) {
                // Hides both scores
                $scope.homeWon = false;
                $scope.opponentWon = false;
            } else {
                $scope.homeWon = $scope.homeTeamScore > $scope.opposingTeamScore;
                $scope.opponentWon = !$scope.homeWon;
            }
        }

        return filmInfo;
    }
]);
