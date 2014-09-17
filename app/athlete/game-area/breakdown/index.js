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
                    '$q', '$stateParams', 'FiltersetsFactory', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'Athlete.Data.Dependencies',
                    function($q, $stateParams, filtersets, leagues, teams, games, players, plays, data) {

                        return $q.all(data).then(function(data) {

                            var gameId = $stateParams.id;

                            /* TODO: Maybe not do this. */
                            var game = games.get(gameId);
                            data.game = game;

                            /* TODO: Or this. */
                            var team = teams.get(game.teamId);
                            var league = leagues.get(team.leagueId);
                            data.league = league;
                            data.filterset = filtersets.get(data.league.filterSetId);

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

                            var playsFilter = { gameId: game.id };

                            var playsList = plays.load(playsFilter).then(function() {

                                data.plays = plays.getList(playsList);
                            });

                            return $q.all([teamPlayerList, opposingTeamPlayerList, playsList]).then(function() {
                                return $q.all(data);
                            });
                        });
                    }
                ]
            }
        };

        $stateProvider.state(gameArea);

    }
]);

Breakdown.controller('Athlete.GameArea.Breakdown.controller', [
    '$scope', '$state', '$stateParams', 'LeaguesFactory', 'GamesFactory', 'PlaysFactory', 'FiltersetsFactory', 'Athlete.GameArea.Breakdown.Data',
    function controller($scope, $state, $stateParams, leagues, games, plays, filtersets, data) {

        $scope.gameId = $state.params.id;
        $scope.videoTitle = 'filmBreakdown';
        $scope.data = data;
        $scope.teamId = data.game.teamId;
        $scope.leagues = leagues.getCollection();
        $scope.league = $scope.leagues[$scope.team.leagueId];
        $scope.expandAll = false;

        //Player List
        $scope.teamPlayerList = data.gamePlayerLists[data.game.teamId];
        $scope.opposingPlayerList = data.gamePlayerLists[data.game.opposingTeamId];

        //Plays
        $scope.totalPlays = angular.copy(data.plays);
        $scope.plays = $scope.totalPlays;

    }
]);
