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
    '$q', 'SessionService', 'UsersFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'PositionsetsFactory', 'Base.Data.Dependencies',
    function($q, session, users, teams, games, players, positionsets, data) {

        var currentUser = session.currentUser;
        var teamId = currentUser.currentRole.teamId;

        var gamesForUser = games.load({
            uploaderTeamId: session.currentUser.currentRole.teamId
        });

        var gamesSharedWithUser = games.load({
            sharedWithUserId: session.currentUser.id
        });

        var Data = {

            positionSets: positionsets.load(),
            teams: teams.load({ relatedUserId: currentUser.id }),
            users: users.load({ relatedUserId: currentUser.id }),
            games: $q.all([gamesForUser, gamesSharedWithUser])
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

