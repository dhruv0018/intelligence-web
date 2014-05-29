/* Component dependencies */
require('coach-game');
require('film-home');
require('game-area');
require('coach-team');
require('add-film');
require('team-info');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Coach module.
 * @module Coach
 */

var Coach = angular.module('Coach', [
    'Coach.Game',
    'Coach.FilmHome',
    'Coach.GameArea',
    'Coach.Team',
    'Coach.Team.Info',
    'add-film'
]);

/**
 * Coach state router.
 * @module Coach
 * @type {UI-Router}
 */
Coach.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var Coach = {
            name: 'Coach',
            url: '/coach',
            parent: 'base',
            abstract: true
        };

        $stateProvider.state(Coach);
    }
]);

/**
 * Coach Data service.
 * @module Coach
 * @type {service}
 */
Coach.service('Coach.Data', [
    '$q', 'SessionService', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'LeaguesFactory', 'TagsetsFactory', 'PositionsetsFactory','IndexingService',
    function($q, session, teams, games, players, leagues, tagsets, positions, indexing) {
        var promises = {};
        var deferred = $q.defer();
        var promisedGames = $q.defer();
        var promisedIndexedGames = $q.defer();
        var promisedTeam = $q.defer();
        var promisedTeams = $q.defer();
        var promisedRoster = $q.defer();
        var promisedRosterId = $q.defer();
        var promisedLeague = $q.defer();
        var promisedPositionSet = $q.defer();

        //TODO get real teamroster id
        var data = {
            teamId: session.currentUser.currentRole.teamId,
            games: promisedGames,
            team: promisedTeam,
            roster: {}
        };

        games.getList({teamId: data.teamId}, function(gamesList) {
            promisedGames.resolve(gamesList);
            promisedIndexedGames.resolve(games.transformIndexed(gamesList));
        });

        teams.getList(function(teams) {
            promisedTeams.resolve(teams);
            promisedTeam.resolve(teams[data.teamId]);

            data.roster = teams[data.teamId].roster;

            if (typeof data.roster !== 'undefined') {
                promisedRosterId.resolve({id: data.roster.id});
                players.getList({
                    roster: data.roster.id
                }, function(players) {
                    promisedRoster.resolve(players);
                }, function(failure) {
                    promisedRoster.resolve([]);
                });
            } else {
                promisedRoster.resolve([]);
                promisedRosterId.resolve({id: null});
            }

            leagues.get(teams[data.teamId].leagueId, function(league) {

                tagsets.getList().$promise.then(function(tagset) {
                    promisedLeague.resolve(league);
                });

                if (league.positionSetId) {
                    positions.get(league.positionSetId, function(positionSet) {
                        promisedPositionSet.resolve(positionSet);
                    }, null, true);
                }
            });

        }, function() {
            console.log('failure to get the teams');
        }, true);

        promises = {
            games: promisedGames.promise,
            indexedGames: promisedIndexedGames.promise,
            coachTeam: promisedTeam.promise,
            teams: promisedTeams.promise,
            league: promisedLeague.promise,
            roster: promisedRoster.promise,
            rosterId: promisedRosterId.promise,
            positionSet: promisedPositionSet.promise
        };

        return $q.all(promises);
    }
]);

/**
 * Game data value service.
 * @module Game
 * @name Game.Data
 * @type {value}
 */
Coach.service('Coach.Game.Data', ['$q', 'Coach.Data',
    function($q, coachData) {

        var promisedGameData = $q.defer();

        coachData.then(function(coachData) {
            var gameData = coachData;
            gameData.opposingTeam = {
                players: []
            };

            promisedGameData.resolve(gameData);
        });

        return promisedGameData.promise;
    }

]);
