/* Component dependencies */
require('film-home');
require('coach-team');
require('add-film');
require('team-info');
require('analytics');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Coach module.
 * @module Coach
 */

var Coach = angular.module('Coach', [
    'Coach.FilmHome',
    'Coach.Analytics',
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
    '$q', 'SessionService', 'TeamsFactory', 'ReelsFactory', 'GamesFactory', 'PlayersFactory', 'UsersFactory', 'LeaguesFactory', 'TagsetsFactory', 'FiltersetsFactory', 'PositionsetsFactory', 'ROLE_TYPE', 'ROLES',
    function($q, session, teams, reels, games, players, users, leagues, tagsets, filtersets, positionsets, ROLE_TYPE, ROLES) {

        var Data = {

            tagsets: tagsets.load(),
            filtersets: filtersets.load(),
            positionsets: positionsets.load(),

            get users() {

                var userId = session.currentUser.id;

                return users.load({ relatedUserId: userId });
            },

            get teams() {

                var userId = session.currentUser.id;

                return teams.load({ relatedUserId: userId });
            },

            get gamesForTeam() {

                var teamId = session.currentUser.currentRole.teamId;

                return games.load({ uploaderTeamId: teamId });
            },

            get gamesSharedWithUser() {

                var userId = session.currentUser.id;

                return games.load({ sharedWithUserId: userId });
            },

            get reels() {

                var userId = session.currentUser.id;
                var teamId = session.currentUser.currentRole.teamId;

                return reels.load({
                    userId: userId,
                    teamId: teamId
                });
            },

            get playersList() {

                var teamId = session.currentUser.currentRole.teamId;

                return teams.load(teamId).then(function() {

                    var team = teams.get(teamId);

                    return players.load({ rosterId: team.roster.id });
                });
            },

            get remainingBreakdowns() {

                var teamId = session.currentUser.currentRole.teamId;

                return teams.getRemainingBreakdowns(teamId).then(function(breakdownData) {

                    session.currentUser.remainingBreakdowns = breakdownData;

                    return breakdownData;
                });
            }
        };

        return Data;
    }
]);
