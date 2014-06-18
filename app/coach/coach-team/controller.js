/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team page module.
 * @module Team
 */
var Team = angular.module('Coach.Team');

/**
 * Coach team page data service.
 * @module Team
 * @type {service}
 */
Team.service('Coach.Team.Data', [
    '$q', 'SessionService', 'TeamsFactory', 'PlayersFactory', 'Coach.Data',
    function($q, session, teams, players, data) {
        var teamId = session.currentUser.currentRole.teamId;

        if (!teamId) return $q.reject(new Error('Could not get current users team'));

        var team = teams.get(teamId).$promise;

        var roster = team.then(function(team) {

            if (team.roster) {

                return players.getList({ roster: team.roster.id }).$promise.then(function(playersList) {

                    return playersList;

                }, function() {

                    return [];
                });
            }

            else return [];
        });

        var rosterId = team.then(function(team) {

            if (team.roster) {

                return team.roster.id;
            }

            else {

                team.roster = {

                    teamId: team.id
                };

                return team.save().then(function() {

                    return teams.get(teamId).$promise.then(function(team) {

                        return team.roster.id;
                    });
                });
            }
        });

        var teamData = {
            coachData: data,
            team: team,
            rosterId: rosterId,
            roster: roster
        };

        return $q.all(teamData);
    }
]);

/**
 * Team controller.
 * @module Team
 * @name Team.controller
 * @type {controller}
 */
Team.controller('Coach.Team.controller', [
    '$rootScope', '$scope', '$state', '$stateParams', '$filter', 'config', 'ROLES', 'Coach.Team.Data', 'PlayersFactory', 'UsersFactory',
    function controller($rootScope, $scope, $state, $stateParams, $filter, config, ROLES, data, players, users) {
        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.config = config;
        $scope.players = players;
        $scope.users = users;
        $scope.data = data;

        $scope.filtering = [
            {type: 'none'},
            {type: 'active'},
            {type: 'inactive'}
        ];

        if (typeof $scope.data.coachData.roster !== 'undefined') {
            $scope.data.roster = $scope.data.coachData.roster;
        }

        angular.forEach($scope.data.roster, function(player) {
            player = players.constructPositionDropdown(player, $scope.data.rosterId, $scope.data.coachData.positionSet.indexedPositions);
        });

        $scope.singleSave = function(player) {
            var tempPlayer = players.getPositionsFromDowndown(player, $scope.data.rosterId, $scope.data.coachData.positionSet.indexedPositions);
            players.singleSave($scope.data.rosterId, tempPlayer).then(function(player) {
                player = players.constructPositionDropdown(player, $scope.data.rosterId, $scope.data.coachData.positionSet.indexedPositions);
                $scope.data.roster.pop();
                $scope.data.roster.push(player);

            });
        };

        $scope.sortPlayers = function(player) {
            return Number(player.jerseyNumbers[data.rosterId]);
        };
    }
]);

