/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Dropdown
 * @module Game Area Dropdown
 */
var GameAreaDropdown = angular.module('gameAreaDropdown', [
    'ui.router',
    'ui.bootstrap',
    'multi-select'
]);

/* Cache the template file */
GameAreaDropdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('game-area-dropdown.html', template);
    }
]);

/**
 * Game Area Dropdown directive.
 * @module Game Area Dropdown
 * @name Game Area Dropdown
 * @type {Directive}
 */
GameAreaDropdown.directive('gameAreaDropdown', [
    function directive() {

        var gameAreaDropdown = {

            restrict: TO += ELEMENTS,

            templateUrl: 'game-area-dropdown.html',

            scope: {
                game: '=',
                ngModel: '='
            },

            link: function(scope, element, attrs) {
            },
            controller: 'gameAreaDropdown.controller'
        };

        return gameAreaDropdown;
    }
]);

/**
 * Game Area Dropdown controller
*/
GameAreaDropdown.controller('gameAreaDropdown.controller', [
    '$scope', 'GamesFactory',
    function controller($scope, games) {
        $scope.gameStates = [
            {
                name: 'Film Breakdown',
                state: 'ga-film-breakdown'
            },
            {
                name: 'Raw Film',
                state: 'ga-raw-film'
            },
            {
                name: 'Formation Report',
                state: 'ga-formations'
            },
            {
                name: 'Down and Distance Report',
                state: 'ga-down-distance'
            },
            {
                name: 'Shot Chart',
                state: 'ga-shot-chart'
            },
            {
                name: 'Statistics',
                state: 'ga-statistics'
            },
            {
                name: 'Game Information',
                state: 'ga-info'
            }
        ];

        if ($scope.game.isVideoTranscodeComplete() && $scope.game.isDelivered()) {
            $scope.defaultState = $scope.gameStates.indexOf('Film Breakdown');
        } else if ($scope.game.isVideoTranscodeComplete() && !$scope.game.isDelivered()) {
            $scope.defaultState = $scope.gameStates.indexOf('Raw Film');
            console.log($scope.defaultState);
        } else {
            $scope.defaultState = $scope.gameStates[6];
        }
    }
]);
