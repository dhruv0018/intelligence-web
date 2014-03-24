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
Users.controller('UserController', [
    '$rootScope', '$scope', '$state', '$stateParams', '$localStorage', 'SessionService', 'AuthenticationService', 'AlertsService', 'ROLES', 'UsersFactory',
    function controller($rootScope, $scope, $state, $stateParams, $localStorage, session, auth, alerts, ROLES, users) {

        /* Setup $scope. */

        $scope.ROLES = ROLES;
        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;

        $scope.users = users;

        $scope.currentUser = session.currentUser;

        $scope.auth = auth;

        $scope.$storage = $localStorage;

        /* Get the user from storage. */
        var user = $scope.$storage.user;

        /* If no user is stored locally, then get the user from the server. */
        if (!user) {

            /* Get the user ID from the state parameters. */
            var userId = $stateParams.id;

            /* Make sure there is a user ID before contacting the server. */
            if (userId) {

                /* Get the user by ID from the server if given. */
                users.get(userId, function(user) {

                    /* Store the user locally. */
                    $scope.$storage.user = user;

                    /* If the user has roles, they already exist, so use a known role. */
                    if ($scope.$storage.user.roles) {

                        /* Set the role to the users default role, or
                        * their first role if no default is set. */
                        $scope.role = $scope.$storage.user.getDefaultRole() ||
                                    $scope.$storage.user.roles[0] ||
                                    undefined;
                    }
                });
            }
        }

        $scope.$storage.user = $scope.$storage.user || {};
        $scope.$storage.user.newRoles = [];


        /* Setup watches. */


        $scope.$watch('$storage.user.isLocked', function(isLocked) {
            if (!isLocked) {

                alerts.clear();
            }

            else if ($scope.$storage.user.id && isLocked) {

                alerts.add({

                    type: 'danger',
                    message: 'This user is locked'
                });
            }
        });

        $scope.$watch('user.roles', function(roles) {

            $scope.disableSave = !roles || roles.length < 1;

        }, true);


        $scope.save = function(user) {

            /* Check if the modified user is the currently logged in user. */
            if (session.currentUser.id === user.id) {

                /* If so, update the current user. */
                session.storeCurrentUser(user);
            }

            users.save(user).then(function() {
                delete $scope.$storage.user;
                $state.go('users');
            });
        };

        $scope.addNewRole = function(newRole) {

            if (!newRole) return;

            /* In the case of an Admin role, there is no information to fill in,
             * so add the role directly. */
            if (users.is(newRole, ROLES.ADMIN)) {

                $scope.$storage.user.roles = $scope.$storage.user.roles || [];
                $scope.$storage.user.roles.unshift(angular.copy(newRole));

            /* For other roles; fill in information before adding. */
            } else {

                $scope.$storage.user.newRoles = $scope.$storage.user.newRoles || [];
                $scope.$storage.user.newRoles.unshift(angular.copy(newRole));
            }
        };
    }
]);

