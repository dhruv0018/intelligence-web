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
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', '$filter', 'ROLES', 'Coach.Team.Data', 'PlayersFactory',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, $filter, ROLES, data, players) {
        $scope.roster = [];

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;

        $scope.team = data.team;
        angular.extend($scope.roster, data.roster, $scope.roster);
        $scope.roster = players.constructPositionDropdown($scope.roster, $scope.rosterId, $scope.positions);
        $scope.rosterId = data.rosterId;
        $scope.positions = data.coachData.positionSet.indexedPositions;


        $scope.state = 'Coach.Team.All';

        $scope.$watch('state', function(state) {

            if (state) $state.go(state);
        });

        $scope.save = function() {
            $scope.roster = players.getPositionsFromDowndown($scope.roster, $scope.rosterId, $scope.positions);
            players.save($scope.rosterId, $scope.roster).then(function(players) {
                $scope.roster = players;

                data.then(function(data) {
                    data.roster = players;
                });
            });
        };

        $scope.sortPlayers = function(player) {
            return Number(player.jerseyNumbers[$scope.rosterId]);
        };
    }
]);

