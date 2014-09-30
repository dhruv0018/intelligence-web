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
    '$q', 'SessionService', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'UsersFactory', 'LeaguesFactory', 'TagsetsFactory', 'PositionsetsFactory', 'Base.Data.Dependencies', 'ROLE_TYPE', 'ROLES',
    function($q, session, teams, games, players, users, leagues, tagsets, positionsets, data, ROLE_TYPE, ROLES) {
        var currentUser = session.currentUser;
        var teamId = currentUser.currentRole.teamId;

        var Data = {
            positionSets: positionsets.load(),
            teams: teams.load({ relatedUserId: currentUser.id }),
            users: users.load({ relatedUserId: currentUser.id }),
            games: games.load({ uploaderTeamId: teamId })
        };

        Data.playersList = $q.all(data).then(function() {

            var team = teams.get(teamId);

            var playersFilter = { rosterId: team.roster.id };

            return players.load(playersFilter).then(function() {
                return players.getList(playersFilter);
            });
        });

        Data.assistantCoaches = Data.users.then(function(users) {
            var assistantCoaches = [];
            angular.forEach(users.getList(), function(user) {
                if (user.roleTypes[ROLE_TYPE.ASSISTANT_COACH]) {

                    var assistantCoachRole = user.roleTypes[ROLE_TYPE.ASSISTANT_COACH].filter(function(role) {
                        return role.teamId && role.teamId === session.currentUser.currentRole.teamId;
                    })[0];

                    if (assistantCoachRole) {
                        assistantCoaches.push(user);
                    }

                }
            });

            return assistantCoaches;
        });

        angular.extend(Data, data);

        return Data;
    }
]);
