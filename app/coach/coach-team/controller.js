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

            $scope.positions = data.coachData.positionSet.positions;

            angular.forEach($scope.roster, function(player){
                player.selectedPositions = {};

                angular.forEach($scope.positions, function(position){
                    player.selectedPositions[position.id] = false;
                });

                if (typeof player.positions[$scope.rosterId] !== 'undefined' && player.positions[$scope.rosterId].length > 0) {

                    angular.forEach(player.positions[$scope.rosterId], function(position){
                        player.selectedPositions[position.id] = true;
                    });

                    console.log(player);
                }
            });



        });

        $scope.$watch('roster', function(roster){
//            angular.forEach($scope.roster, function(player){
//                console.log(player);
//
//                if (typeof player.positions[$scope.rosterId] !== 'undefined' && player.positions[$scope.rosterId].length > 0) {
//                    player.selectedPosition = player.positions[$scope.rosterId][0];
//                    console.log(player.selectedPosition);
//                }
//            });
            //console.log(roster);
        }, true);

        $scope.state = 'Coach.Team.All';

        $scope.$watch('state', function(state) {

            if (state) $state.go(state);
        });

        $scope.save = function() {

            angular.forEach($scope.roster, function(player){
                //angular quirk, why does it set models to false
                console.log(player);

                player.selectedPositions[$scope.rosterId] = player.selectedPositions[$scope.rosterId].filter(function(position) {
                    return position !== false;
                });
                player.positions = {};
                player.positions[$scope.rosterId] = player.selectedPositions[$scope.rosterId];

            });

            console.log($scope.roster);

            players.save($scope.rosterId, $scope.roster).then(function(players) {
                $scope.roster = players;

                data.then(function(data) {
                    data.roster = players;
                });
            });
        };
    }
]);

