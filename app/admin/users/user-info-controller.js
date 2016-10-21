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
    '$scope', '$stateParams', 'ROLES', 'SessionService', 'AlertsService', 'UsersFactory', 'Admin.Users.Data', 'EMAIL_REQUEST_TYPES',
    function controller($scope, $stateParams, ROLES, session, alerts, users, data, EMAIL_REQUEST_TYPES) {

        $scope.users = users;
        $scope.passwordRequest = EMAIL_REQUEST_TYPES.FORGOTTEN_PASSWORD;
        $scope.sendingEmail = false;

        $scope.isLockDisabled = function() {

            var userId = $stateParams.id;
            if (userId) {
                var user = users.get($stateParams.id);

                /* Enable the lock button for new users. */
                if (!user) return false;

                /* Super admin can only be locked from the database. */
                else if (user.has(ROLES.SUPER_ADMIN)) return true;

                /* Admins can only be locked by super admins. */
                else if (user.has(ROLES.ADMIN)) return !session.currentUser.is(ROLES.SUPER_ADMIN);
            }

            /* For other users, assume the lock button is enabled. */
            return false;
        };

        $scope.resetPassword = () => {
            alerts.clear();
            $scope.sendingEmail = true;
            let onSend = () => {
                const user = $scope.user;
                const message = `A password reset email has been sent to ${user.firstName} ${user.lastName} (${user.email})`;
                const type = 'success';
                alerts.add({type, message});
            };

            let onFinish = () => {
                $scope.sendingEmail = false;
            };

            users.resendEmail($scope.passwordRequest, null, $scope.user.email)
            .then(onSend)
            .finally(onFinish);
        };
    }
]);
