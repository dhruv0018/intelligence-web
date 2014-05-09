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

        var data = {
            coachData: data,
            team: team,
            roster: roster,
            rosterId: rosterId
        };

        return $q.all(data);
    }
]);

/**
 * Team controller.
 * @module Team
 * @name Team.controller
 * @type {controller}
 */
Team.controller('Coach.Team.controller', [
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', '$filter', 'ROLES', 'Coach.Team.Data', 'PlayersFactory',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, $filter, ROLES, data, players) {

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;

        data.then(function(data) {
            $scope.team = data.team;
            $scope.roster = data.roster;
            $scope.rosterId = data.rosterId;
            $scope.positions = data.coachData.positionSet[0].positions;
            $scope.adjustedPositions = {};
            console.log($scope.positions);
        });

        $scope.state = 'Coach.Team.All';

        $scope.$watch('state', function(state) {

            if (state) $state.go(state);
        });

        $scope.save = function() {
            var firstPlayer = $scope.roster[3];
            var position = firstPlayer.selectedPosition;
            firstPlayer.positions = {};
            firstPlayer.positions[$scope.rosterId] = [position];
            console.log(firstPlayer);

            players.save($scope.rosterId, $scope.roster).then(function(players) {
                $scope.roster = players;

                data.then(function(data) {
                    data.roster = players;
                });
            });
        };
    }
]);

