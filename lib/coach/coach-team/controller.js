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
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', '$filter', 'ROLES', 'SessionService', 'UsersFactory', 'TeamsFactory', 'SportsFactory', 'LeaguesResource', 'SchoolsResource',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, $filter, ROLES, session, users, teams, sports, leagues, schools) {

        $scope.state = $state.current.name;

        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;

        var teamId = session.currentUser.currentRole.teamId;

        if (teamId) {

            teams.get(teamId, function(team) {

                $scope.team = team;
                $scope.teamMembers = team.getMembers();
            });
        }

        $scope.$watch('state', function(state) {

            if (state) $state.go(state);
        });
    }
]);

