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
    '$q', 'SessionService', 'PositionsetsFactory', 'UsersFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'ReelsFactory', 'ROLE_TYPE',
    function($q, session, positionsets, users, teams, games, players, reels, ROLE_TYPE) {

        var userId = session.currentUser.id;
        var teamId = session.currentUser.currentRole.teamId;

        //Get reels created by user
        var reelsForUser = reels.load({
            userId: userId
        });

        //Get reels shared with athlete
        var athleteRoles = session.currentUser.roleTypes[ROLE_TYPE.ATHLETE];
        var reelsSharedWithTeam = [];
        var reelsSharedWithUser = [];

        //TODO - use relatedUserId
        athleteRoles.forEach(function(role, index) {

            reelsSharedWithTeam[index] = reels.load({
                sharedWithTeamId: athleteRoles[index].teamId
            });

            reelsSharedWithUser[index] = reels.load({
                sharedWithUserId: userId
            });
        });

        var Data = {

            positionsets: positionsets.load(),
            users: users.load({ relatedUserId: userId }),
            teams: teams.load({ relatedUserId: userId }),
            games: games.load({ relatedUserId: userId }),
            reels: $q.all([reelsForUser, reelsSharedWithTeam, reelsSharedWithUser])
        };

        Data.athlete = {
            players: players.load({
                userId: userId
            })
        };



        return Data;
    }
]);

