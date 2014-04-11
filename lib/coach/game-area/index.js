require('./gameAreaInformation.js');
require('./gameAreaFilm.js');
require('./gameAreaStatistics.js');
require('./gameAreaShotChart.js');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Film page module.
 * Game Area page module.
 * @module GameArea
 */
var GameArea = angular.module('Coach.GameArea', [
    'ui.router',
    'ui.bootstrap',
    'Coach.Game',
    'game-area-information',
    'game-area-film',
    'game-area-statistics',
    'game-area-shot-chart'
]);

/* Cache the template file */
GameArea.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/game-area/template.html', require('./template.html'));
    }
]);

/**
 * GameArea page state router.
 * @module GameArea
 * @type {UI-Router}
 */
GameArea.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Coach.GameArea', {
            url: '/game-area/:id',
            views: {
                'main@root': {
                    templateUrl: 'coach/game-area/template.html',
                    controller: 'Coach.GameArea.controller'
                }
            }
        });
    }
]);

/**
 * GameArea controller.
 * @module GameArea
 * @name GameAreaController
 * @type {Controller}
 */
GameArea.controller('Coach.GameArea.controller', [
    '$scope', '$state', 'GamesFactory',
    function controller($scope, $state, games) {

        $scope.gameId = $stateParams.id;

        //TODO remove later when we have data for shot charts and statistics
        $scope.hasShotChart = false;
        $scope.hasStatistics = false;

        $scope.$storage = $localStorage;

        games.get($scope.gameId, function(game) {

            $scope.game = game;
            $scope.gameStatus = GAME_STATUS_IDS[game.status];
        });

        //view selector
        $scope.dataType = 'video';

        $scope.$watch('dataType', function (data) {
            if ($scope.dataType === 'game-info') {
                $state.go('ga-info');
            } else if ($scope.dataType === 'video') {
                $state.go('ga-film');
            } else if ($scope.dataType === 'statistics') {
                $state.go('ga-statistics');
            } else if ($scope.dataType === 'shot-chart') {
                $state.go('ga-shot-chart');
            } else {
                $state.go('game-area');
            }
        });
    }
]);

