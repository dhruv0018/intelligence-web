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
 * @name Team.Inactive.controller
 * @type {controller}
 */
Team.controller('Coach.Team.Inactive.controller', [
    '$scope',
    function controller($scope) {

        $scope.isInactive = function(player) {

            return player.rosterStatuses[$scope.rosterId] === false;
        };
    }
]);

