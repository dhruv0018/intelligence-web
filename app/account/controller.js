const angular = window.angular;

AccountController.$inject = [
    '$scope',
    'ROLES'
];

/**
 * Account page controller
 */
function AccountController(
    $scope,
    ROLES
) {
    $scope.ROLES = ROLES;
}

export default AccountController;
