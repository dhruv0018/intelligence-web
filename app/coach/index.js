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
                let deferred = $q.defer();
                let currentId = session.getCurrentUserId();

                // Load a fresh copy of the user to get the latest role ID
                // TODO: Remove this once role IDs are locked down and user cache
                //       problems with old, potentially changed role IDs are cleared
                users.load(currentId).then(function(){
                    let role = users.get(currentId).getCurrentRole();

                    teams.load({ relatedRoleId: role.id }).then(function(){
                        let team = teams.get(role.teamId);

                        players.load({ rosterId: team.roster.id }).then(function(){deferred.resolve();});
                    });
                });

                return deferred.promise;
            },

            get games() {
                let deferred = $q.defer();
                let currentId = session.getCurrentUserId();

                // Load a fresh copy of the user to get the latest role ID
                // TODO: Remove this once role IDs are locked down and user cache
                //       problems with old, potentially changed role IDs are cleared
                users.load(currentId).then(function(){
                    let roleId = users.get(currentId).getCurrentRole().id;

                    games.load({ relatedRoleId: roleId }).then(function(){deferred.resolve();});
                });

                return deferred.promise;
            },

            get reels() {

                var userId = session.currentUser.id;

                return reels.load({ relatedUserId: userId });
            }
        };

        return Data;
    }
]);
