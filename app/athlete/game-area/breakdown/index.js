/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Athlete game area film breakdown page module.
 * @module Breakdown
 */
var Breakdown = angular.module('Athlete.GameArea.Breakdown', [
    'ui.router',
    'ui.bootstrap'
]);

Breakdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/game-area/breakdown/template.html', require('./template.html'));
    }
]);

Breakdown.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'Athlete.GameArea.Breakdown',
            url: '/film-breakdown',
            parent: 'Athlete.GameArea',
            views: {
                'content@Athlete.GameArea': {
                    templateUrl: 'athlete/game-area/breakdown/template.html',
                    controller: 'Athlete.GameArea.Breakdown.controller'
                }
            },
            resolve: {
                'Athlete.GameArea.Breakdown.Data': [
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

Breakdown.controller('Athlete.GameArea.Breakdown.controller', [
    '$scope', '$stateParams', 'LeaguesFactory', 'FiltersetsFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'PlayManager', 'ReelsFactory',
    function controller($scope, $stateParams, leagues, filtersets, teams, games, players, plays, playManager, reels) {

        var gameId = $stateParams.id;
        var game = games.get(gameId);
        $scope.game = game;

        var team = teams.get(game.teamId);
        $scope.league = leagues.get(team.leagueId);
        $scope.reels = reels.getList();

        if (game.isDelivered()) {
            $scope.filterset = filtersets.get($scope.league.filterSetId);
        }

        // Players
        var teamPlayersFilter = { rosterId: game.getRoster(game.teamId).id };
        $scope.teamPlayers = players.getList(teamPlayersFilter);

        var opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
        $scope.opposingTeamPlayers = players.getList(opposingTeamPlayersFilter);

        // Plays
        var playsFilter = { gameId: game.id };
        $scope.totalPlays = plays.getList(playsFilter);
        $scope.plays = $scope.totalPlays;

        $scope.filteredPlaysIds = [];

        $scope.expandAll = false;
    }
]);
