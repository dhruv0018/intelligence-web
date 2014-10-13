/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team page module.
 * @module Team
 */
var TeamRoster = angular.module('coach-team-roster');

/**
 * TeamRoster controller.
 * @module Team
 * @name Team.controller
 * @type {controller}
 */

TeamRoster.controller('Coach.Team.Roster.controller', [
    '$rootScope', '$scope', '$state', '$stateParams', '$filter', 'AlertsService', 'config', 'ROLES', 'Coach.Team.Data', 'LeaguesFactory', 'PositionsetsFactory', 'TeamsFactory', 'PlayersFactory', 'UsersFactory', 'SessionService',
    function controller($rootScope, $scope, $state, $stateParams, $filter, alerts, config, ROLES, data, leagues, positionsets, teams, players, users, session) {
        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.config = config;
        $scope.playersFactory = players;
        $scope.usersFactory = users;
        $scope.data = data;

        //toggles between player views
        $scope.filtering = [
            {type: 'active'},
            {type: 'inactive'}
        ];

        //Collections
        $scope.teams = teams.getCollection();
        $scope.leagues = leagues.getCollection();
        $scope.users = users.getCollection();

        //Team
        $scope.team = teams.get(session.currentUser.currentRole.teamId);

        //League
        $scope.league = leagues.get($scope.team.leagueId);

        //Positions
        $scope.positionset = positionsets.get($scope.league.positionSetId);
        $scope.positions = $scope.positionset.indexedPositions;

        //Roster
        $scope.roster = $scope.data.playersList;
        $scope.rosterId = $scope.team.roster.id;

        alerts.add({
            type: 'warning',
            message: 'All game film is automatically shared with Athletes on your active roster.'
        });

        $scope.singleSave = function(player, user) {

            if (!player.userId) {
                user.firstName = player.firstName;
                user.lastName = player.lastName;
                users.addRole(user, ROLES.ATHLETE, $scope.team);
                return user.save().then(function(user) {
                    player.userId = user.id;
                    return players.singleSave($scope.rosterId, player).then(function(responsePlayer) {
                        angular.extend(player, player, responsePlayer);
                        return responsePlayer;
                    });
                });
            } else {
                player.firstName = user.firstName;
                player.lastName = user.lastName;
                users.addRole(user, ROLES.ATHLETE, $scope.team);
                user.save();
                return players.singleSave($scope.rosterId, player).then(function(responsePlayer) {
                    angular.extend(player, player, responsePlayer);
                    return responsePlayer;
                });
            }

        };

        $scope.sortPlayers = function(rosterEntry) {
            console.log(rosterEntry);
            return Number(rosterEntry.jerseyNumber);
        };
    }
]);

