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
    '$rootScope', '$scope', '$state', '$stateParams', '$filter', 'AlertsService', 'config', 'ROLES', 'PlayersFactory', 'UsersFactory', 'TeamsFactory', 'LeaguesFactory', 'SessionService',
    function controller($rootScope, $scope, $state, $stateParams, $filter, alerts, config, ROLES, players, users, teams, leagues, session) {
        $scope.ROLES = ROLES;
        $scope.HEAD_COACH = ROLES.HEAD_COACH;
        $scope.config = config;
        $scope.playersFactory = players;
        $scope.usersFactory = users;

        //Collections
        $scope.teams = teams.getCollection();
        $scope.leagues = leagues.getCollection();
        $scope.users = users.getCollection();

        $scope.team = teams.get(session.currentUser.currentRole.teamId);

        const ACTIVE = true;
        $scope.assistantCoaches = users.findByRole(ROLES.ASSISTANT_COACH, $scope.team, ACTIVE);
        $scope.assistantCoaches = $scope.assistantCoaches.concat(users.findByRole(ROLES.ASSISTANT_COACH, $scope.team, !ACTIVE));

        //toggles between assistant views
        $scope.filtering = [
            {type: 'active'},
            {type: 'inactive'}
        ];

        $scope.displayFilter = $scope.filtering[0];

        alerts.add({
            type: 'warning',
            message: 'All game film is automatically shared amongst all coaches of the team.'
        });

    }
]);

require('./controller');
