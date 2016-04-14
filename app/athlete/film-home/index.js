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
    function data($q, session, positionsets, users, teams, games, players, reels, ROLE_TYPE) {

        var userId = session.getCurrentUserId();
        var teamId = session.getCurrentTeamId();

        var Data = {

            positionsets: positionsets.load(),
            users: users.load({ relatedUserId: userId }),
            teams: teams.load({ relatedUserId: userId }),
            games: games.load({ relatedUserId: userId }),
            reels: reels.load({ relatedUserId: userId})
        };

        Data.players = Data.teams.then(function() {

            let athleteRoles = session.currentUser.getRoles(ROLE_TYPE.ATHLETE);
            let rosterIds = [];

            athleteRoles.forEach(function(role, index) {
                let team = teams.get(role.teamId);
                rosterIds.push(team.roster.id);
            });

            let rosters = {
                'rosterId[]': rosterIds
            };

            return $q.all({
                rosters: players.load(rosters)
            });
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
