/* Component dependencies */
require('coach-game');
require('film-home');
require('game-area');
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
    'Coach.Game',
    'Coach.FilmHome',
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
    '$q', 'SessionService', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'UsersFactory', 'LeaguesFactory', 'TagsetsFactory', 'PositionsetsFactory', 'Base.Data.Dependencies',
    function($q, session, teams, games, players, users, leagues, tagsets, positions, baseData) {

        var promises = {
            games: games.load({
                uploaderTeamId: session.currentUser.currentRole.teamId
            }),
            teams: teams.load({ relatedUserId: session.currentUser.id }),
            users: users.load({ relatedUserId: session.currentUser.id }),
            remainingBreakdowns: teams.getRemainingBreakdowns(session.currentUser.currentRole.teamId),
            positionSets: positions.load(),
            leagues: baseData.leagues,
            sports: baseData.sports,
            filtersets: baseData.filtersets,
            tagsets: baseData.tagsets
        };

        promises.playersList = promises.teams.then(function(teams) {
            var userTeamId = session.currentUser.currentRole.teamId;
            var userTeam = teams.get(userTeamId);
            return players.query({
                rosterId: userTeam.roster.id
            });
        });

        return promises;
    }
]);

