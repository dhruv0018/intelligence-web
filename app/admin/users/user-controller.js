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
    '$rootScope', '$scope', '$state', '$stateParams', 'SessionService', 'AuthenticationService', 'AlertsService', 'ROLES', 'Users.User.Service', 'UsersFactory',
    function controller($rootScope, $scope, $state, $stateParams, session, auth, alerts, ROLES, user, users) {

        $scope.ROLES = ROLES;
        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;

        $scope.user = user;
        $scope.users = users;
        $scope.auth = auth;

        user = user || {};
        user.newRoles = [];

        /* If the user has roles, use a known role. */
        if (user.roles) {

            /* Set the role to the users default role, or
            * their first role if no default is set. */
            $scope.userrole = user.getDefaultRole() || user.roles[0] || undefined;
        }

        $scope.save = function(user) {

            /* Check if the modified user is the currently logged in user. */
            if (session.currentUser.id === user.id) {

                /* If so, update the current user. */
                session.storeCurrentUser(user);
            }

            users.save(user).then(function() {

                $state.go('users');
            });
        };
    }
]);

