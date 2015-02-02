/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Athlete.FilmHome', [
    'ui.router',
    'ui.bootstrap',
    'film',
    'no-results'
]);

/* Cache the template files */
FilmHome.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/film-home/template.html', require('./template.html'));
    }
]);

/**
 * FilmHome page state router.
 * @module FilmHome
 * @type {UI-Router}
 */
FilmHome.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Athlete.FilmHome', {
            url: '/film-home',
            views: {
                'main@root': {
                    templateUrl: 'athlete/film-home/template.html',
                    controller: 'Athlete.FilmHome.controller'
                }
            },
            resolve: {
                'Athlete.FilmHome.Data': [
                    '$q', 'Athlete.FilmHome.Data.Dependencies',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);


/**
 * Athlete Film Home Data service.
 * @module Athlete.FilmHome
 * @type {service}
 */
FilmHome.service('Athlete.FilmHome.Data.Dependencies', [
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

        Data.players = Data.teams.then(function() {
            //Get all players from user's teams TODO: use relatedUserId
            var teamPlayers = [];
            athleteRoles.forEach(function(role, index) {
                var team = teams.get(role.teamId);

                teamPlayers.push(players.load({
                    rosterId: team.roster.id
                }));
            });

            return $q.all(teamPlayers);
        });

        Data.athlete = {
            players: players.load({
                userId: userId
            })
        };

        return Data;
    }
]);

/* File dependencies */
require('./controller');

