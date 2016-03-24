/* Component dependencies */
require('film-home');
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
    'Coach.FilmHome',
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
    '$stateProvider',
    '$urlRouterProvider',
    function config(
        $stateProvider,
        $urlRouterProvider
    ) {

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
    '$q',
    'SessionService',
    'TeamsFactory',
    'ReelsFactory',
    'GamesFactory',
    'UsersFactory',
    'PlayersFactory',
    'ROLE_TYPE',
    'ROLES',
    function($q,
        session,
        teams,
        reels,
        games,
        users,
        players,
        ROLE_TYPE,
        ROLES
    ) {

        var Data = {

            get users() {

                var userId = session.currentUser.id;

                return users.load({ relatedUserId: userId });
            },

            get teamsAndPlayers() {

                var userId = session.currentUser.id;

                teams.load({ relatedUserId: userId }).then(function(){
                    var team = teams.get(session.currentUser.currentRole.teamId);

                    return players.load({ rosterId: team.roster.id });
                });
            },

            get games() {

                var userId = session.currentUser.id;

                return games.load({ relatedUserId: userId });
            },

            get reels() {

                var userId = session.currentUser.id;

                return reels.load({ relatedUserId: userId });
            }
        };

        return Data;
    }
]);
