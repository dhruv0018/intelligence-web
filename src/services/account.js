var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * A service to manage a users account state. It handles setting the users role
 * and broadcasting the change.
 * @module IntelligenceWebClient
 * @name AccountService
 * @type {service}
 */
IntelligenceWebClient.service('AccountService', [
    '$rootScope', 'SessionService',
    function($rootScope, session) {

        return {

            changeUserRole: function(user, role) {

                if (!user) throw new Error('Can not change role; no user given.');
                if (!role) throw new Error('Can not change role; no role to change to');

                /* Broadcast the role change. */
                $rootScope.$broadcast('roleChangeStart', user.currentRole);

                /* Change the users role. */
                user.setDefaultRole(role);

                /* Update the user in the session. */
                session.storeCurrentUser(user);

                /* Assert that the users role has been changed to the desired role. */
                if (angular.equals(session.currentUser.currentRole, role)) {

                    /* Broadcast successful role change. */
                    $rootScope.$broadcast('roleChangeSuccess', role);

                } else {

                    /* Broadcast role change error. */
                    $rootScope.$broadcast('roleChangeError', role);
                }
            },

            changeCurrentUserRole: function(role) {

                this.changeUserRole(session.currentUser, role);
                location.reload();
            }
        };
    }
]);

