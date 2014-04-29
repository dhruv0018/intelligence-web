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
    '$scope', 'ROLES', 'Users.User.Service', 'UsersFactory',
    function controller($scope, ROLES, user, users) {

        $scope.addNewRole = function(newRole) {

            if (!newRole) return;

            /* In the case of an Admin role, there is no information to fill in,
             * so add the role directly. */
            if (users.is(newRole, ROLES.ADMIN)) {

                $scope.user.roles = $scope.user.roles || [];
                $scope.user.roles.unshift(angular.copy(newRole));

            /* For other roles; fill in information before adding. */
            } else {

                $scope.user.newRoles = $scope.user.newRoles || [];
                $scope.user.newRoles.unshift(angular.copy(newRole));
            }
        };
    }
]);

