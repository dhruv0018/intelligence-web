/* Component dependencies */
require('film-home');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Athlete module.
 * @module Athlete
 */

var Athlete = angular.module('Athlete', [
    'Athlete.FilmHome'
]);

/**
 * Athlete state router.
 * @module Athlete
 * @type {UI-Router}
 */
Athlete.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var Athlete = {
            name: 'Athlete',
            url: '/athlete',
            parent: 'base',
            abstract: true
        };

        $stateProvider.state(Athlete);
    }
]);

/**
 * Athlete Data service.
 * @module Athlete
 * @type {service}
 */
Athlete.service('Athlete.Data.Dependencies', [
    '$q', 'SessionService', 'UsersFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory',
    function($q, session, users, teams, games, players) {

        var teamId = session.currentUser.currentRole.teamId;

        var Data = {

            users: users.load(),
            teams: teams.load(),
            games: games.load({
                uploaderTeamId: teamId
            })
        };

        Data.athlete = {
            players: players.load({
                userId: session.currentUser.id
            })
        };



        return Data;
    }
]);

