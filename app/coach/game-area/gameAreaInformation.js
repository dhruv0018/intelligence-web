/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Information page module.
 * @module GameArea
 */
var GameAreaInformation = angular.module('game-area-information', [
    'ui.router',
    'ui.bootstrap'
]);

GameAreaInformation.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaInformation.html', require('./gameAreaInformation.html'));
    }
]);

GameAreaInformation.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-info',
            url: '/information',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaInformation.html',
                    controller: 'GameAreaInformationController'
                }
            },
            resolve: {
                'GameAreaInformation.Data': [
                    '$q', '$stateParams', 'SessionService', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'Coach.Data.Dependencies',
                    function($q, $stateParams, session, leagues, teams, games, players, data) {

                        return $q.all(data).then(function(data) {

                            var gameId = $stateParams.id;

                            var teamId = session.currentUser.currentRole.teamId;


                            var game = games.get(gameId);
                            data.game = game;
                            data.gamePlayerLists = {};

                            var promises = [];
                            promises.push(teams.getRemainingBreakdowns(teamId).then(function(breakdownData) {
                                data.remainingBreakdowns = breakdownData;
                            }));

                            return $q.all(promises).then(function() {

                                return data;
                            });
                        });
                    }
                ]
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaInformation.controller('GameAreaInformationController', [
    '$scope', '$state', '$stateParams', '$modal', 'AlertsService', 'SessionService', 'GamesFactory', 'TeamsFactory', 'LeaguesFactory', 'GameAreaInformation.Data',
    function controller($scope, $state, $stateParams, $modal, alerts, session, games, teams, leagues, data) {

        var gameId = $stateParams.id;
        var game = games.get(gameId);
        $scope.game = game;
        $scope.league = leagues.get(teams.get(session.currentUser.currentRole.teamId).leagueId);
        $scope.remainingBreakdowns = data.remainingBreakdowns;

        //Player List
        $scope.teamPlayerList = data.gamePlayerLists[game.teamId];
        $scope.opposingPlayerList = data.gamePlayerLists[game.opposingTeamId];

        if ($scope.game.isProcessing()) {
            alerts.add({
                type: 'warning',
                message: 'Your video is still processing. You may still edit the Game Information for this film.'
            });
        } else if ($scope.game.isUploading()) {
            alerts.add({
                type: 'warning',
                message: 'This film is currently uploading. You may still edit the Game Information for this film.'
            });
        }
    }
]);
