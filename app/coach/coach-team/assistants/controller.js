/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Team page module.
 * @module Team
 */
var TeamRoster = angular.module('coach-team-assistants');

/**
 * TeamRoster controller.
 * @module Team
 * @name Team.controller
 * @type {controller}
 */
TeamRoster.controller('Coach.Team.Assistants.controller', [
    '$rootScope', '$scope', '$state', '$stateParams', '$filter', 'AlertsService', 'config', 'ROLES', 'Coach.Data', 'PlayersFactory', 'UsersFactory', 'SessionService',
    function controller($rootScope, $scope, $state, $stateParams, $filter, alerts, config, ROLES, data, players, users, session) {
        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.config = config;
        $scope.playersFactory = players;
        $scope.usersFactory = users;
        $scope.data = data;

        //toggles between assistant views
        $scope.filtering = [
            {type: 'active'},
            {type: 'inactive'}
        ];

        //Collections
        $scope.teams = $scope.data.teams.getCollection();
        $scope.leagues = $scope.data.leagues.getCollection();
        $scope.users = users.getCollection();

        //Team
        $scope.team = $scope.teams[session.currentUser.currentRole.teamId];

        alerts.add({
            type: 'warning',
            message: 'All game film is automatically shared amongst all coaches of the team'
        });

    }
]);

require('./controller');
