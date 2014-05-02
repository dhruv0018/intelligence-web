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
    '$scope', 'PlayersFactory',
    function controller($scope, players) {

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

                player.rosterStatuses[$scope.rosterId] = false;
            }

            else {

                $scope.roster.splice($scope.roster.indexOf(player), 1);
            }
        };

        $scope.save = function() {

            players.save($scope.rosterId, $scope.roster).then(function(players) {

                $scope.roster = players;
            });
        };
    }
]);

