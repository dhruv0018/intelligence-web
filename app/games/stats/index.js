/* Fetch angular from the browser scope */
const angular = window.angular;

const GamesStats = angular.module('Games.Stats', []);

import template from './template.html';

GamesStats.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        const gameStats = {
            name: 'Games.Stats',
            url: '/statistics',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    template,
                    controller: 'GamesStats.controller'
                }
            },
            resolve: {
                'Games.Stats.Data': [
                    '$q', '$stateParams', 'UsersFactory', 'TeamsFactory', 'FiltersetsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'LeaguesFactory',
                    function($q, $stateParams, users, teams, filtersets, games, players, plays, leagues) {

                        var gameId = Number($stateParams.id);
                        return games.load(gameId).then(function() {

                            var game = games.get(gameId);

                            var Data = {
                                user: users.load(game.uploaderUserId),
                                team: teams.load([game.uploaderTeamId, game.teamId, game.opposingTeamId])
                            };

                            var teamPlayersFilter = { rosterId: game.getRoster(game.teamId).id };
                            Data.loadTeamPlayers = players.load(teamPlayersFilter);

                            var opposingTeamPlayersFilter = { rosterId: game.getRoster(game.opposingTeamId).id };
                            Data.loadOpposingTeamPlayers = players.load(opposingTeamPlayersFilter);

                            var playsFilter = { gameId: game.id };
                            Data.loadPlays = plays.load(playsFilter);

                            //todo -- deal with this, real slow because of nesting
                            Data.league = Data.team.then(function() {
                                var uploaderTeam = teams.get(game.uploaderTeamId);
                                return leagues.fetch(uploaderTeam.leagueId);
                            });

                            Data.filterSet = Data.league.then(function() {
                                var uploaderTeam = teams.get(game.uploaderTeamId);
                                var uploaderLeague = leagues.get(uploaderTeam.leagueId);
                                return filtersets.fetch(uploaderLeague.filterSetId);
                            });

                            Data.stats = games.generateStats($stateParams.id).then(function(stats) {
                                return stats;
                            });

                            return $q.all(Data);
                        });
                    }
                ]
            }
        };

        $stateProvider.state(gameStats);

    }
]);

GamesStats.controller('GamesStats.controller', [
    '$scope', '$state', '$stateParams', 'Games.Stats.Data', 'GamesFactory', 'TeamsFactory',
    function controller($scope, $state, $stateParams, data, games, teams) {
        let gameId = Number($stateParams.id);
        $scope.stats               = data.stats;
        $scope.game                = games.get(gameId);
        $scope.teams               = [teams.get($scope.game.teamId), teams.get($scope.game.opposingTeamId)];

        const team = teams.get($scope.game.teamId);
        $scope.sport = team.getSport();

    }
]);

export default GamesStats;
