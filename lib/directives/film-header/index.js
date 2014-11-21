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

    'TeamsFactory', 'UsersFactory',
    function directive(teams, users) {

        var filmHeader = {

            restrict: TO += ELEMENTS,

            scope: {
                'title': '=',
                'isPublic': '=',
                'film': '='
            },

            link: link,

            templateUrl: 'film-header.html',

        };

        function link($scope, element, attrs) {

            /* Logic for team name data */

            var homeTeamExists = angular.isDefined($scope.film.teamId);
            var opposingTeamExists = angular.isDefined($scope.film.opposingTeamId);

            $scope.teamsExist = homeTeamExists || opposingTeamExists;

            if ($scope.teamsExist) {
                var teamsCollection = teams.getCollection();
                $scope.homeTeamName = homeTeamExists ? teamsCollection[$scope.film.teamId].name : 'Home';
                $scope.opposingTeamName = opposingTeamExists ? teamsCollection[$scope.film.opposingTeamId].name : 'Away';
            } else {
                $scope.homeTeamName = 'Home';
                $scope.opposingTeamName = 'Away';
            }

            /* Logic for game score data */

            var inputtedGameScoresExist = ($scope.film.finalScore !== 0) && ($scope.film.opposingFinalScore !== 0);
            var indexedGameScoresExist = angular.isDefined($scope.film.indexedScore) && angular.isDefined($scope.film.opposingIndexedScore);

            $scope.gameScoresExist = inputtedGameScoresExist || indexedGameScoresExist;

            if ($scope.gameScoresExist) {

                if (inputtedGameScoresExist) {
                    // Use inputted scores by default
                    $scope.homeTeamScore = $scope.film.finalScore;
                    $scope.opposingTeamScore = $scope.film.opposingFinalScore;
                } else {
                    // Else fallback on indexed scores
                    $scope.homeTeamScore = $scope.film.indexedScore;
                    $scope.opposingTeamScore = $scope.film.opposingIndexedScore;
                }

                // Logic for CSS class toggle
                if ($scope.homeTeamScore === $scope.opposingTeamScore) {
                    $scope.homeWon = false;
                    $scope.opponentWon = false;
                } else {
                    $scope.homeWon = $scope.homeTeamScore > $scope.opposingTeamScore;
                    $scope.opponentWon = !$scope.homeWon;
                }
            }

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
