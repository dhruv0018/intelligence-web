/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Coach game area film breakdown page module.
 * @module Breakdown
 */
var Breakdown = angular.module('Coach.GameArea.Breakdown', [
    'ui.router',
    'ui.bootstrap'
]);

Breakdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/game-area/breakdown/template.html', require('./template.html'));
    }
]);

Breakdown.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'Coach.GameArea.Breakdown',
            url: '/film-breakdown',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/breakdown/template.html',
                    controller: 'Coach.GameArea.Breakdown.controller'
                }
            },
            resolve: {
                'Coach.Data': [
                    '$q', '$stateParams', 'FiltersetsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'Coach.Data.Dependencies',
                    function($q, $stateParams, filtersets, games, players, plays, data) {

                        return $q.all(data).then(function() {

                            var gameId = $stateParams.id;
                            var game = games.get(gameId);

                            var teamPlayersFilter = { rosterId: game.getRoster(game.teamId).id };
                            var loadTeamPlayers = players.load(teamPlayersFilter);

                            var opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
                            var loadOpposingTeamPlayers = players.load(opposingTeamPlayersFilter);

                            var playsFilter = { gameId: game.id };
                            var loadPlays = plays.load(playsFilter);

                            return $q.all([loadTeamPlayers, loadOpposingTeamPlayers, loadPlays]);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(gameArea);
    }
]);

Breakdown.controller('Coach.GameArea.Breakdown.controller', [
    '$scope', '$stateParams', 'LeaguesFactory', 'ReelsFactory', 'FiltersetsFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'PlayManager',
    function controller($scope, $stateParams, leagues, reels, filtersets, teams, games, players, plays, playManager) {
//
//        var gameId = $stateParams.id;
//        var game = games.get(gameId);
//        $scope.game = game;
//        $scope.videoTitle = 'filmBreakdown';
//        $scope.playManager = playManager;
//
//        var team = teams.get(game.teamId);
//        $scope.league = leagues.get(team.leagueId);
//        $scope.reels = reels.getList();
//
//        if (game.isDelivered()) {
//            $scope.filterset = filtersets.get($scope.league.filterSetId);
//        }
//
//        // Players
//        var teamPlayersFilter = { rosterId: game.getRoster(game.teamId).id };
//        $scope.teamPlayers = players.getList(teamPlayersFilter);
//
//        var opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
//        $scope.opposingTeamPlayers = players.getList(opposingTeamPlayersFilter);
//
//        // Plays
//        var playsFilter = { gameId: game.id };
//        $scope.totalPlays = plays.getList(playsFilter);
//        $scope.plays = $scope.totalPlays;
//
//        $scope.filteredPlaysIds = [];
//
//        $scope.expandAll = false;
    }
]);
