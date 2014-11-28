/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Statistics page module.
 * @module GameArea
 */
var GamesStats = angular.module('Games.Stats', [
    'ui.router',
    'ui.bootstrap'
]);

GamesStats.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaStatistics.html', require('./template.html'));
    }
]);

GamesStats.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'Games.Stats',
            url: '/statistics',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'coach/game-area/gameAreaStatistics.html',
                    controller: 'GamesStatsController'
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

        $stateProvider.state(gameArea);

    }
]);

GamesStats.controller('GamesStatsController', [
    '$scope', '$state', '$stateParams', 'Game.Stats.Data', 'SPORTS',
    function controller($scope, $state, $stateParams, data, SPORTS) {
        $scope.gameLogTable = data.stats.gameLog;
        $scope.homeTeamStats = data.stats.homeTeamStats;
        $scope.awayTeamStats = data.stats.awayTeamStats;

        $scope.homeTeamName = data.stats.homeTeamStats.meta.teamName;
        $scope.awayTeamName = data.stats.awayTeamStats.meta.teamName;

        $scope.scoreSummary = data.stats.scoreSummary;
        $scope.showScoreSummary = false;

        if (data.stats.scoreSummary !== null) {
            $scope.showScoreSummary = true;
        }

        $scope.statsSelector = data.stats.gameLog ? 'ga-log' : '';
    }
]);

