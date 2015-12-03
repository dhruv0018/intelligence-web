/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

/**
 * User roles controller. Controls the view for a users roles.
 * @module Users
 * @name User.Roles.Controller
 * @type {Controller}
 */
Users.controller('Users.User.Roles.Controller', [
    '$scope', 'ROLES', 'UsersFactory',
    function controller($scope, ROLES, users) {
        $scope.rolesChanged = false;
        $scope.addNewRole = function(newRole) {
            if (!newRole) return;

            /* In the case of an Admin role, there is no information to fill in,
             * so add the role directly. */
            if (users.is(newRole, ROLES.ADMIN)) {

                $scope.user.addRole(newRole);

            /* For other roles; fill in information before adding. */
            } else {

                $scope.newRoles = $scope.newRoles || [];
                $scope.newRoles.unshift(angular.copy(newRole));
            }
            $scope.rolesChanged = true;
        };

        $scope.ROLES = ROLES;
    }
]);
