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
    '$rootScope', '$scope', '$http', 'PlayersFactory', 'config', 'Coach.Data',
    function controller($rootScope, $scope, $http, players, config, data) {

        $scope.isActive = function(player) {

            return player.rosterStatuses[$scope.rosterId] !== false;
        };

        $scope.addNewPlayer = function() {

            var player = {

                jerseyNumbers: {},
                rosterStatuses: {},
                positions: {},
                selectedPositions: {}
            };

            player.selectedPositions[$scope.rosterId] = [];

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

        $scope.uploadRoster = function(files) {
            var file = files[0];
            var data = new FormData();

            data.append('rosterId', $scope.rosterId);
            data.append('roster', file);

            $http.post(config.api.uri + 'batch/players/file',

                data, {
                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .success(function(uploadedPlayers) {
                    players.getList({
                        roster: $scope.rosterId
                    }, function(roster) {
                        angular.extend($scope.roster, $scope.roster, roster);
                        $scope.roster = players.constructPositionDropdown(roster, $scope.rosterId, $scope.positions);
                    });

                })
                .error(function() {

                    $rootScope.$broadcast('alert', {

                        type: 'danger',
                        message: 'There was a problem. Please try again.'
                    });
                });
        };

    }
]);

