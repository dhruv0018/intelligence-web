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
Coach.service('Coach.Data.Dependencies', [
    '$q', 'SessionService', 'UsersFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'Base.Data.Dependencies',
    function($q, session, users, teams, games, players, data) {

        var teamId = session.currentUser.currentRole.teamId;

        var Data = {

            users: users.load(),
            teams: teams.load(),
            games: games.load({
                uploaderTeamId: teamId
            })
        };

        Data.playersList = Data.teams.then(function(teams) {

            var team = teams.get(teamId);

            return players.load({
                rosterId: team.roster.id
            }).then(function() {
                return players.getList();
            });
        });

        angular.extend(Data, data);

        return Data;
    }
]);

