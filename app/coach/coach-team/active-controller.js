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
Team.controller('Coach.Team.Active.controller', [
    '$scope', 'PlayersFactory', 'Coach.Data',
    function controller($scope, players, data) {

        $scope.isActive = function(player) {

            return player.rosterStatuses[$scope.rosterId] !== false;
        };

        $scope.addNewPlayer = function() {

            var player = {

                jerseyNumbers: {},
                rosterStatuses: {}
            };

            player.rosterStatuses[$scope.rosterId] = true;

            $scope.roster.push(player);
        };

        $scope.deactivate = function(player) {

            if (player && player.id) {

                player.toggleActivation($scope.rosterId);
            }

            else {

                $scope.roster.splice($scope.roster.indexOf(player), 1);
            }
        };

    }
]);

