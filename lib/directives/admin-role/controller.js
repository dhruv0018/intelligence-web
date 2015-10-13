/**
* AdminRole.Controller dependencies
*/
AdminRoleController.$inject = [
    '$scope',
    'ROLES',
    'INDEXER_GROUPS_ID',
    'UsersFactory',
    'TeamsFactory',
    'SchoolsFactory'
];

/**
 * AdminRole.Controller
 * @module AdminRole
 * @name AdminRole.Controller
 * @type {Controller}
 */
function AdminRoleController (
    $scope,
    ROLES,
    INDEXER_GROUPS_ID,
    users,
    teams,
    schools
) {

    $scope.ROLES = ROLES;

    $scope.INDEXER_GROUPS_ID = INDEXER_GROUPS_ID;

    $scope.users = users;

    $scope.team = ($scope.role && $scope.role.teamId)? teams.get($scope.role.teamId) : null;

    $scope.school = ($scope.team && $scope.team.schoolId) ? schools.get($scope.team.schoolId) : null;
}

export default AdminRoleController;
