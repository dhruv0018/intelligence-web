/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Users page module.
 * @module Users
 */
var Users = angular.module('Users');

/**
 * User info controller. Controls the view for a users info.
 * @module Users
 * @name User.Info.Controller
 * @type {Controller}
 */
Users.controller('Users.User.Info.Controller', [
    '$scope', 'ROLES', 'SessionService', 'AlertsService', 'Users.User.Service',
    function controller($scope, ROLES, session, alerts, user) {

        $scope.isLockDisabled = function() {

            /* Super admin can only be locked from the database. */
            if (user.has(ROLES.SUPER_ADMIN)) return true;

            /* Admins can only be locked by super admins. */
            else if (user.has(ROLES.ADMIN)) return !session.currentUser.is(ROLES.SUPER_ADMIN);

            /* For other users, assume the lock button is enabled. */
            else return false;
        };

        /* Watch the users lock status. */
        $scope.$watch('user.isLocked', function(newValue, oldValue) {

            /* Only update when there is a change. */
            if (newValue !== oldValue) {

                /* If the user is locked; add alert. */
                if (newValue) {

                    alerts.add({

                        type: 'danger',
                        message: 'This user is locked'
                    });

                /* When the users is unlocked; clear alert. */
                } else {

                    alerts.clear();
                }
            }
        });
    }
]);

