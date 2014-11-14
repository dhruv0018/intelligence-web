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

    function directive() {

        var filmHeader = {

            restrict: TO += ELEMENTS,

            scope: {
                'isPublic': '=',
                'game': '=',
                'homeTeam': '=',
                'opposingTeam': '='
            },

            link: link,

            templateUrl: 'film-header.html',

        };

        function link($scope, element, attrs) {

            if ($scope.game.finalScore === $scope.game.opposingFinalScore) {
                $scope.homeWon = false;
                $scope.opponentWon = false;
            } else {
                $scope.homeWon = ($scope.game.finalScore > $scope.game.opposingFinalScore) ? true : false;
                $scope.opponentWon = !$scope.homeWon;
            }

            switch ($scope.game.description) {
                case 'games':
                    $scope.gameTitle = 'Raw Film';
                    break;
                case 'plays':
                    $scope.gameTitle = 'Clip';
                    break;
                default:
                    $scope.gameTitle = 'Other';
            }
        }

        return filmHeader;
    }
]);
