/* Fetch angular from the browser scope */
var angular = window.angular;

var GamesStats = angular.module('Games.Stats', []);

GamesStats.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('games/statistics.html', require('./template.html'));
    }
]);

GamesStats.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameStats = {
            name: 'Games.Stats',
            url: '/statistics',
            parent: 'Games',
            views: {
                'gameView@Games': {
                    templateUrl: 'games/statistics.html',
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
    '$scope', '$state', '$stateParams', 'Games.Stats.Data', 'SPORTS',
    function controller($scope, $state, $stateParams, data, SPORTS) {

        $scope.stats = parseStatsData(data.stats);
    }
]);

function parseStatsData(statsObject) {

    // Remove extraneous properties
    delete statsObject.$promise;
    delete statsObject.$resolved;

    // Mock table names
    statsObject.gameLog.meta.tableName = 'Game Log';
    statsObject.homeTeamStats.meta.tableName = 'Home Team';
    statsObject.awayTeamStats.meta.tableName = 'Away Team';

    // Mock index
    statsObject.gameLog.meta.index = 0;
    statsObject.homeTeamStats.meta.index = 1;
    statsObject.awayTeamStats.meta.index = 2;

    // Handle score summary property
    if (statsObject.scoreSummary === null) {

        delete statsObject.scoreSummary;
    }
    else {

        statsObject.scoreSummary.meta.tableName = 'Score Summary';
        statsObject.scoreSummary.meta.index = 3;
    }

    // Convert Object to array ordered by statsObject.table.meta.index
    let statsKeys = Object.keys(statsObject);
    statsKeys.sort((a, b) => statsObject[a].meta.index > statsObject[b].meta.index);
    let statsArray = [];
    statsKeys.forEach(key => statsArray.push(statsObject[key]));

    return statsArray;
}
