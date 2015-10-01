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

            get games() {

                var userId = session.currentUser.id;

                return games.load({ relatedUserId: userId });
            },

            get gamesSharedWithTeam() {

                var teamId = session.getCurrentTeamId();

                return games.load({ sharedWithTeamId: teamId });
            },

            get reels() {

                var userId = session.currentUser.id;

                return reels.load({ relatedUserId: userId });
            },

            get reelsSharedWithTeam() {

                var teamId = session.getCurrentTeamId();

                return reels.load({ sharedWithTeamId: teamId });
            },

            get players() {

                var teamIds = session.currentUser.getTeamIds();

                return this.teams.then(function(relatedTeams) {

                    var rosters = [];

                    relatedTeams

                    .filter(function(team) {

                        return ~teamIds.indexOf(team.id);
                    })

                    .forEach(function(team) {

                        rosters.push(players.load({ rosterId: team.roster.id }));
                    });

                    return $q.all(rosters);
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
