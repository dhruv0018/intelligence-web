var pkg = require('../../package.json');

/* Take a moment */
var moment = require('moment');

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
IntelligenceWebClient.service('AccountService', AccountService);

AccountService.$inject = [
    'config',
    'ROLES',
    '$rootScope',
    '$state',
    '$q',
    'SessionService',
    'TermsDialog.Service'
];

function AccountService (
    config,
    ROLES,
    $rootScope,
    $state,
    $q,
    session,
    TermsDialog
) {

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

                this.gotoUsersHomeState(user, true);

            } else {

                /* Broadcast role change error. */
                $rootScope.$broadcast('roleChangeError', role);
            }
        },

        changeCurrentUserRole: function(role) {

            this.changeUserRole(session.currentUser, role);
        },

        gotoUsersHomeState: function(user, reload) {

            user = user || session.currentUser;

            /* If the user has more than one role, but has not selected
             * a default one yet. */
            if (user.isActive() && !user.defaultRole) {

                return $state.go('roles', false);
            }

            /* If the user is a super admin or an admin. */
            else if (user.is(ROLES.SUPER_ADMIN) || user.is(ROLES.ADMIN)) {

                return $state.go('users', null, { reload: reload });
            }

            /* If the user is an indexer. */
            else if (user.is(ROLES.INDEXER)) {

                return $state.go('indexer-games', null, { reload: reload });
            }

            /* If the user is a coach. */
            else if (user.is(ROLES.COACH)) {

                return $state.go('Coach.FilmHome', null, { reload: reload });
            }

            /* If the user is an athlete. */
            else if (user.is(ROLES.ATHLETE)) {

                return $state.go('Athlete.FilmHome', null, { reload: reload });
            }

            else {

                return $state.go('Account.ContactInfo', null, { reload: reload });
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
            session.clearPreviousUser();

            var currentUser = session.retrieveCurrentUser();

            $rootScope.currentUser = currentUser;
            this.gotoUsersHomeState(currentUser, true);
        },

        /**
         * Determines if the user has accepted the Terms & Conditions.
         * @method hasAcceptedTerms
         * @return {Boolean} True if yes, false if no
         */

        hasAcceptedTerms: function hasAcceptedTerms () {

            let user              = session.currentUser;
            let lastAccessedDate  = user.getLastAccessed();
            let termsAcceptedDate = user.getTermsAcceptedDate() ? moment(user.getTermsAcceptedDate()) : false;
            let termsDate         = moment(config.termsDate);

            if (!lastAccessedDate) {

                /* This is a new user; already accepted Terms & Conditions
                 * by setting new password. */
                user.termsAcceptedDate = new Date().toISOString();
                user.save();

                return true;

            } else if (!termsAcceptedDate) {

                return false;

            /* Compare posting date and last accepted date. If difference is
             * greater than zero, terms posting date is more recent. */
            } else if (termsDate.diff(termsAcceptedDate) > 0) {

                return false;
            } else {

                return true;
            }
        }
    };
}
