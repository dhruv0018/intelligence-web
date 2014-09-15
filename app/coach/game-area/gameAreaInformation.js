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
        $templateCache.put('coach/game-area/deleteGame.html', require('./deleteGame.html'));
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

                            /* TODO: Maybe not do this. */
                            var game = games.get(gameId);
                            data.game = game;

                            /* TODO: Or this. */
                            var team = teams.get(game.teamId);
                            var league = leagues.get(team.leagueId);
                            data.league = league;

                            data.remainingBreakdowns = teams.getRemainingBreakdowns(teamId);

                            /* TODO: Refactor this. */
                            data.gamePlayerLists = {};

                            var teamPlayersFilter = { rosterId: game.rosters[game.teamId].id };
                            var teamPlayerList = players.load(teamPlayersFilter).then(function() {

                                var teamPlayers = players.getList(teamPlayersFilter);
                                data.teamPlayers = teamPlayers;
                                data.gamePlayerLists[game.teamId] = teamPlayers;
                            });

                            var opposingTeamPlayersFilter = { rosterId: game.rosters[game.opposingTeamId].id };
                            var opposingTeamPlayerList = players.load(opposingTeamPlayersFilter).then(function() {

                                var opposingTeamPlayers = players.getList(opposingTeamPlayersFilter);
                                data.opposingTeamPlayers = opposingTeamPlayers;
                                data.gamePlayerLists[game.opposingTeamId] = opposingTeamPlayers;
                            });

                            return $q.all([teamPlayerList, opposingTeamPlayerList, data]).then(function() {

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
    '$scope', '$state', '$stateParams', '$modal', 'AlertsService', 'GamesFactory', 'GameAreaInformation.Data',
    function controller($scope, $state, $stateParams, $modal, alerts, games, data) {

        var gameId = $stateParams.id;

        var game = games.get(gameId);

        $scope.data = data;

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

        $scope.confirmation = function() {
            $modal.open({
                scope: $scope,
                templateUrl: 'coach/game-area/deleteGame.html',
                controller: ['$scope', '$state', '$modalInstance', function($scope, $state, $modalInstance) {
                    $scope.deleteGame = function() {
                        $scope.game.isDeleted = true;

                        $scope.game.save().then(function() {
                            $modalInstance.close();
                            $state.go('Coach.FilmHome');
                        }, function() {
                            $modalInstance.close();
                        });
                    };
                }]

            });

        };

    }
]);
