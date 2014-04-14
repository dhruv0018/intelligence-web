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
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', '$filter', 'ROLES', 'SessionService', 'UsersFactory', 'TeamsFactory', 'SportsFactory', 'LeaguesResource', 'SchoolsResource',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, $filter, ROLES, session, users, teams, sports, leagues, schools) {

        $scope.roster = [];

        /*
         * Scope methods.
         */

        $scope.addNewPlayer = function() {

            var player = {

                jerseyNumbers: {}
            };

            $scope.roster.push(player);
        };

        $scope.removePlayer = function(player) {

            if (player) $scope.roster.splice($scope.roster.indexOf(player), 1);
        };

        $scope.save = function() {

            players.save($scope.rosterId, $scope.roster);
        };
    }
]);

