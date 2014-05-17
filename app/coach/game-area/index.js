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
            url: '/game/:id',
            views: {
                'main@root': {
                    templateUrl: 'coach/game-area/template.html',
                    controller: 'Coach.GameArea.controller'
                }
            },
            resolve: {
                'indexingData': ['$stateParams', 'IndexingService', function($stateParams, indexing) {
                    return indexing.init($stateParams.id);
                }]
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
    '$scope', '$state', '$stateParams', '$localStorage', 'PlayersFactory', 'GAME_STATUS_IDS', 'Coach.Data', 'indexingData',
    function controller($scope, $state, $stateParams, $localStorage, players, GAME_STATUS_IDS, data, indexingData) {


        $scope.gameId = $stateParams.id;

        //TODO remove later when we have data for shot charts and statistics
        $scope.hasShotChart = false;
        $scope.hasStatistics = true;

        data.then(function(data) {
            $scope.game = data.indexedGames[$scope.gameId];
            $scope.gameStatus = GAME_STATUS_IDS[$scope.game.status];

            //TODO change to onEnter event when we get resolves working
            if ($scope.game.isDeleted) {
                $state.go('Coach.FilmHome');
            }

            data.game = $scope.game;
            $scope.team = data.teams[$scope.game.teamId];
            $scope.opposingTeam = data.teams[$scope.game.opposingTeamId];

//TODO possibly add this here later instead of on gameAreaFilm file
//            plays.getList($scope.gameId, function (plays) {
//                data.plays = plays;
//            }


            players.getList({
                roster: $scope.game.rosters[$scope.team.id].id
            }, function(players) {
                data.teamGameRoster = {
                    teamId: $scope.team.id,
                    players: players
                };
            }, function(failure) {
                data.teamGameRoster = {
                    teamId: $scope.team.id,
                    players: []
                };
            });

            players.getList({
                roster: $scope.game.rosters[$scope.opposingTeam.id].id
            }, function(players) {
                data.opposingTeamGameRoster = {
                    teamId: $scope.opposingTeam.id,
                    players: players
                };
            }, function(failure) {
                data.opposingTeamGameRoster = {
                    teamId: $scope.opposingTeam.id,
                    players: []
                };
            });
        });

        //view selector
        $scope.dataType = 'video';
        $scope.$watch('dataType', function(data) {
            if ($scope.dataType === 'game-info') {
                $state.go('ga-info');
            } else if ($scope.dataType === 'video') {
                $state.go('ga-film');
            } else if ($scope.dataType === 'statistics') {
                $state.go('ga-statistics');
            } else if ($scope.dataType === 'shot-chart') {
                $state.go('ga-shot-chart');
            } else {
                $state.go('Coach.GameArea');
            }
        });
    }
]);

