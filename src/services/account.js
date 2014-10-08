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
    'ROLES', '$rootScope', '$state', 'SessionService',
    function(ROLES, $rootScope, $state, session) {

        return {

            changeUserRole: function(user, role) {

                if (!user) throw new Error('Can not change role; no user given.');
                if (!role) throw new Error('Can not change role; no role to change to');

                /* Broadcast the role change. */
                $rootScope.$broadcast('roleChangeStart', role);

                /* Change the users role. */
                user.setDefaultRole(role);

                /* Update the user in the session. */
                session.storeCurrentUser(user);

                /* Permanently save the user. */
                user.save();

                /* Assert that the users role has been changed to the desired role. */
                if (angular.equals(user.currentRole, role)) {

                    /* Broadcast successful role change. */
                    $rootScope.$broadcast('roleChangeSuccess', role);

                    this.gotoUsersHomeState(user);

                } else {

                    /* Broadcast role change error. */
                    $rootScope.$broadcast('roleChangeError', role);
                }
            },

            changeCurrentUserRole: function(role) {

                this.changeUserRole(session.currentUser, role);
            },

            gotoUsersHomeState: function(user) {

                user = user || session.currentUser;

                /* If the user is a super admin or an admin. */
                if (user.is(ROLES.SUPER_ADMIN) || user.is(ROLES.ADMIN)) {

                    $state.go('users');
                }

                /* If the user is an indexer. */
                else if (user.is(ROLES.INDEXER)) {

                    $state.go('indexer-games');
                }

                /* If the user is a coach. */
                else if (user.is(ROLES.COACH)) {

                    $state.go('Coach.FilmHome');
                }

                /* If the user is an athlete. */
                else if (user.is(ROLES.ATHLETE)) {

                    $state.go('Athlete.FilmHome');
                }

                else {

                    $state.go('Account.ContactInfo');
                }
            },

            gotoAsUser: function(user) {

                session.storePreviousUser(session.currentUser, false);
                session.storeCurrentUser(user, false);

                var currentUser = session.retrieveCurrentUser();

                $rootScope.currentUser = currentUser;
                this.gotoUsersHomeState(currentUser, true);
            },

            returnToPreviousUser: function() {

                var previousUser = session.retrievePreviousUser();

                session.storeCurrentUser(previousUser);
                delete session.previousUser;

                var currentUser = session.retrieveCurrentUser();

                $rootScope.currentUser = currentUser;
                this.gotoUsersHomeState(currentUser, true);
            }
        };
    }
]);

