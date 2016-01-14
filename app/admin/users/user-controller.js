/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

/**
 * User controller. Controls the view for adding and editing a single user.
 * @module Users
 * @name User.Controller
 * @type {Controller}
 */
Users.controller('Users.User.Controller', [
    '$rootScope', '$scope', '$state', '$stateParams', 'SessionService', 'AuthenticationService', 'AlertsService', 'ROLES', 'Admin.Users.Data', 'UsersFactory',
    function controller($rootScope, $scope, $state, $stateParams, session, auth, alerts, ROLES, data, users) {

        $scope.ROLES = ROLES;
        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;

        $scope.auth = auth;
        $scope.users = users;

        var userId = $stateParams.id;

        $scope.user = userId ? users.get(userId) : users.create();

        $scope.newRoles = [];

        /* If the user has roles, use a known role. */
        if ($scope.user.roles) {

            /* Set the role to the users default role, or their first role if no default is set. */
            $scope.role = $scope.user.getDefaultRole() || $scope.user.roles[0] || undefined;
        }

        $scope.save = function(user) {

            /* Check if the modified user is the currently logged in user. */
            if (session.currentUser.id === user.id) {

                /* If so, update the current user. */
                session.storeCurrentUser(user);
            }

            user.save();

            $state.go('users');
        };
    }
]);
