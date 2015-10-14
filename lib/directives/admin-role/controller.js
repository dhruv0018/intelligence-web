/**
* AdminRole.Controller dependencies
*/
AdminRoleController.$inject = [
    '$scope',
    'ROLES',
    'INDEXER_GROUPS_ID',
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
    teams,
    schools
) {

    $scope.ROLES = ROLES;

    $scope.INDEXER_GROUPS_ID = INDEXER_GROUPS_ID;

    $scope.team = ($scope.role && $scope.role.teamId)? teams.get($scope.role.teamId) : null;

    $scope.school = ($scope.team && $scope.team.schoolId) ? schools.get($scope.team.schoolId) : null;
}

export default AdminRoleController;
