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
TeamRoster.controller('Coach.Team.controller', [
    '$rootScope', '$scope', '$state', '$stateParams', '$filter', 'AlertsService', 'config', 'ROLES', 'Coach.Data', 'PlayersFactory', 'UsersFactory', 'SessionService',
    function controller($rootScope, $scope, $state, $stateParams, $filter, alerts, config, ROLES, data, players, users, session) {
        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.config = config;
        $scope.playersFactory = players;
        $scope.usersFactory = users;
        console.log('working');
        $scope.data = data;

        //toggles between player views
        $scope.filtering = [
            {type: 'active'},
            {type: 'inactive'}
        ];

        //Collections
        $scope.teams = $scope.data.teams.getCollection();
        $scope.leagues = $scope.data.leagues.getCollection();
        $scope.users = users.getCollection();

        //Team
        $scope.team = $scope.teams[session.currentUser.currentRole.teamId];

        //League
        $scope.league = $scope.leagues[$scope.team.leagueId];

        //Positions
        $scope.positions = ($scope.league.positionSetId) ? $scope.data.positionSets.getCollection()[$scope.league.positionSetId].indexedPositions : {};

        //Roster
        $scope.roster = $scope.data.playersList;
        $scope.rosterId = $scope.teams[session.currentUser.currentRole.teamId].roster.id;

        alerts.add({
            type: 'warning',
            message: 'All game film is automatically shared with Athletes on your active roster.'
        });

        $scope.singleSave = function(player) {

            players.singleSave($scope.rosterId, player).then(function(responsePlayer) {
                angular.extend(player, player, responsePlayer);

                if (player.userId) {
                    if (typeof $scope.users[player.userId] === 'undefined') {
                        users.fetch(player.userId, function(user) {
                            $scope.data.users[player.userId] = user.id;
                        });
                    } else {
                        var associatedUser = users.get(player.userId);
                        associatedUser.save();
                    }
                }

            });
        };

        $scope.sortPlayers = function(player) {
            return Number(player.jerseyNumbers[$scope.rosterId]);
        };
    }
]);

