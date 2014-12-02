/* Component dependencies */
require('film-home');
require('game-area');
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
    '$q', 'SessionService', 'TeamsFactory', 'ReelsFactory', 'GamesFactory', 'PlayersFactory', 'UsersFactory', 'LeaguesFactory', 'TagsetsFactory', 'PositionsetsFactory', 'Base.Data.Dependencies', 'ROLE_TYPE', 'ROLES',
    function($q, session, teams, reels, games, players, users, leagues, tagsets, positionsets, data, ROLE_TYPE, ROLES) {

        var userId = session.currentUser.id;
        var teamId = session.currentUser.currentRole.teamId;

        var gamesForUser = games.load({
            uploaderTeamId: session.currentUser.currentRole.teamId
        });

        var gamesSharedWithUser = games.load({
            sharedWithUserId: userId
        });

        var Data = {
            positionSets: positionsets.load(),
            teams: teams.load({ relatedUserId: userId }),
            users: users.load({ relatedUserId: userId }),
            games: $q.all([gamesForUser, gamesSharedWithUser]),
            reels: reels.load({ relatedUserId: userId }),
            remainingBreakdowns:  teams.getRemainingBreakdowns(teamId).then(function(breakdownData) {
                session.currentUser.remainingBreakdowns = breakdownData;
                return breakdownData;
            })
        };

        Data.playersList = $q.all(data).then(function() {

            var team = teams.get(teamId);

            var playersFilter = { rosterId: team.roster.id };

            return players.load(playersFilter).then(function() {
                return players.getList(playersFilter);
            });
        });

        angular.extend(Data, data);

        return Data;
    }
]);
