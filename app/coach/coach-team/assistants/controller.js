/* Fetch angular from the browser scope */
var angular = window.angular;

CoachTeamAssistantsController.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$filter',
    'config',
    'ROLES',
    'PlayersFactory',
    'UsersFactory',
    'TeamsFactory',
    'LeaguesFactory',
    'SessionService'
];

/**
 * TeamRoster controller.
 * @module Team
 * @name CoachTeamAssistantsController
 * @type {controller}
 */
function CoachTeamAssistantsController($rootScope, $scope, $state, $stateParams, $filter, config, ROLES, players, users, teams, leagues, session) {
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

    //take out duplicate cases
    let tmp = {};
    let tmpArr = [];
    $scope.assistantCoaches.forEach(coach =>{
        tmp[coach.id] = coach;
    });
    angular.forEach(tmp, coach =>{
        tmpArr.push(coach);
    });
    $scope.assistantCoaches = tmpArr;

    //toggles between assistant views
    $scope.filtering = [
        {type: 'active'},
        {type: 'inactive'}
    ];

    $scope.displayFilter = $scope.filtering[0];
}

export default CoachTeamAssistantsController;
