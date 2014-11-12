/* Component dependencies */
require('film-home');
require('game-area');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Athlete module.
 * @module Athlete
 */

var Athlete = angular.module('Athlete', [
    'Athlete.FilmHome',
    'Athlete.GameArea'
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
    '$q', 'SessionService', 'PositionsetsFactory', 'UsersFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'ReelsFactory',
    function($q, session, positionsets, users, teams, games, players, reels) {

        var userId = session.currentUser.id;
        var teamId = session.currentUser.currentRole.teamId;

        var Data = {

            positionsets: positionsets.load(),
            users: users.load(),
            teams: teams.load(),
            games: games.load({
                uploaderTeamId: teamId
            }),
            reels: reels.load({
                teamId: null,
                userId: userId
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

