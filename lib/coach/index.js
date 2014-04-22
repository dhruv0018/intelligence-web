/* Component dependencies */
require('coach-game');
require('film-home');
require('game-area');
require('coach-team');
require('add-film');

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
    '$q', 'SessionService', 'TeamsFactory', 'GamesFactory', 'PlayersFactory',
    function($q, session, teams, games, players) {
        var promises = {};
        var deferred = $q.defer();
        var promisedGames = $q.defer();
        var promisedTeam = $q.defer();
        var promisedTeams = $q.defer();
        var promisedRoster = $q.defer();

        //TODO get real teamroster id
        var data = {
            teamId : session.currentUser.currentRole.teamId,
            games: promisedGames,
            team : promisedTeam,
            rosterId: '25'
        };

        games.getList({teamId: data.teamId}, function(gamesList) {
            promisedGames.resolve(gamesList);
        }, true);

        teams.getList({}, function(teams) {
            promisedTeams.resolve(teams);
            promisedTeam.resolve(teams[data.teamId]);
        }, function() {
            console.log('failure to get the teams');
        }, true);


        players.getList({
            roster: data.rosterId
        }, function (players) {
            promisedRoster.resolve(players);
        });

        promises = {
            games: promisedGames.promise,
            coachTeam: promisedTeam.promise,
            teams: promisedTeams.promise,
            roster: promisedRoster.promise,
            rosterId: $q.when({id: data.rosterId})
        };

        return $q.all(promises);
    }
]);
