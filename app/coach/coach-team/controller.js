/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team page module.
 * @module Team
 */
var Team = angular.module('Coach.Team');

/**
 * Team controller.
 * @module Team
 * @name Team.controller
 * @type {controller}
 */
Team.controller('Coach.Team.controller', [
    '$rootScope', '$scope', '$state', '$stateParams', '$filter', 'AlertsService', 'config', 'ROLES', 'Coach.Data', 'PlayersFactory', 'UsersFactory', 'SessionService',
    function controller($rootScope, $scope, $state, $stateParams, $filter, alerts, config, ROLES, data, players, users, session) {
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
        $scope.teams = $scope.data.teams.getCollection();
        $scope.leagues = $scope.data.leagues.getCollection();

        //Team
        $scope.team = $scope.teams[session.currentUser.currentRole.teamId];

        //League
        $scope.league = $scope.leagues[$scope.team.leagueId];

        //Positions
        $scope.positions = $scope.data.positionSets.getCollection()[$scope.league.positionSetId].indexedPositions;

        //Roster
        $scope.roster = $scope.data.playersList;
        $scope.rosterId = $scope.teams[session.currentUser.currentRole.teamId].roster.id;

        alerts.add({
            type: 'warning',
            message: 'All game film is automatically shared with Athletes on your active roster. Athletes will always have access to game film where they were on the roster'
        });


        angular.forEach($scope.roster, function(player) {
            player = players.constructPositionDropdown(player, $scope.rosterId, $scope.positions);
        });

        $scope.singleSave = function(player) {
            var tempPlayer = players.getPositionsFromDowndown(player, $scope.rosterId, $scope.positions);

            players.singleSave($scope.rosterId, tempPlayer).then(function(responsePlayer) {
                angular.extend(player, player, responsePlayer);
                player = players.constructPositionDropdown(player, $scope.rosterId, $scope.positions);

                if (player.userId) {
                    if (typeof $scope.data.coachData.users[player.userId] === 'undefined') {
                        users.fetch(player.userId, function(user) {
                            $scope.data.users[player.userId] = user.id;
                        });
                    }
                }

            });
        };

        $scope.sortPlayers = function(player) {
            return Number(player.jerseyNumbers[$scope.rosterId]);
        };
    }
]);

