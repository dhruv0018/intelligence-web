const pkg = require('../../package.json');

/* Take a moment */
const moment = require('moment');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

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
    'TeamsFactory',
    'SPORTS'
];

function AccountService (
    config,
    ROLES,
    $rootScope,
    $state,
    $q,
    session,
    teamsFactory,
    SPORTS
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

            let self = this;

            /* Permanently save the user. */
            user.save().then(function(responseUser){
                /* Assert that the users role has been changed to the desired role. */
                if (angular.equals(responseUser.currentRole, role)) {

                    /* Broadcast successful role change. */
                    $rootScope.$broadcast('roleChangeSuccess', role);

                    self.gotoUsersHomeState(user, true);

                } else {

                    /* Broadcast role change error. */
                    $rootScope.$broadcast('roleChangeError', role);
                }
            });
        },

        changeCurrentUserRole: function(role) {

            this.changeUserRole(session.currentUser, role);
        },

        gotoUsersHomeState: function(user, reload) {

            user = user || session.currentUser;

            /* If the user is a super admin or an admin. */
            if (user.is(ROLES.SUPER_ADMIN) || user.is(ROLES.ADMIN)) {
                return $state.go('users', null, { reload });
            }

            /* If the user is a film exchange admin. */
            else if (user.is(ROLES.FILM_EXCHANGE_ADMIN)) {
                return $state.go('film-exchange', {id: null}, {reload: reload});
            }

            /* If the user is an indexer. */
            else if (user.is(ROLES.INDEXER)) {

                return $state.go('IndexerGamesAssigned', null, { reload: reload });
            }

            /* If the user is a coach. */
            else if (user.is(ROLES.COACH)) {

                return teamsFactory.load(user.currentRole.teamId).then(response => {
                    let team = teamsFactory.get(user.currentRole.teamId);
                    if (team.sportId === SPORTS.FOOTBALL.id || team.sportId === SPORTS.VOLLEYBALL.id) {
                        return $state.go('Coach.FilmHome', null, { reload });
                    } else {
                        return $state.go('FilmHomeGames', null, { reload });
                    }
                });
            }

            /* If the user is an athlete. */
            else if (user.is(ROLES.ATHLETE)) {
                return teamsFactory.load(user.currentRole.teamId).then(response => {
                    let team = teamsFactory.get(user.currentRole.teamId);
                    if (team.sportId === SPORTS.FOOTBALL.id || team.sportId === SPORTS.VOLLEYBALL.id) {
                        return $state.go('Athlete.FilmHome', null, { reload });
                    } else {
                        return $state.go('FilmHomeGames', null, { reload });
                    }
                });
            }

            else {

                return $state.go('Account.ContactInfo', null, { reload });
            }
        },

        gotoUsersReelState: function(user, reload) {

            user = user || session.currentUser;

            /* If the user is a coach. */
            if (user.is(ROLES.COACH)) {

                return teamsFactory.load(user.currentRole.teamId).then(response => {
                    let team = teamsFactory.get(user.currentRole.teamId);
                    if (team.sportId === SPORTS.FOOTBALL.id || team.sportId === SPORTS.VOLLEYBALL.id) {
                        return $state.go('Coach.FilmHome', null, { reload });
                    } else {
                        return $state.go('FilmHomeReels', null, { reload });
                    }
                });
            }

            /* If the user is an athlete. */
            else if (user.is(ROLES.ATHLETE)) {
                return teamsFactory.load(user.currentRole.teamId).then(response => {
                    let team = teamsFactory.get(user.currentRole.teamId);
                    if (team.sportId === SPORTS.FOOTBALL.id || team.sportId === SPORTS.VOLLEYBALL.id) {
                        return $state.go('Athlete.FilmHome', null, { reload });
                    } else {
                        return $state.go('FilmHomeReels', null, { reload });
                    }
                });
            }

            else {
                throw new Error('Only coach or athlete can go to reels page.');
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

            /* Get the date the user accepted the terms and conditions. */
            let termsAcceptedDate = user.getTermsAcceptedDate();
            let termsDate         = moment.utc(config.termsDate);

            /* If the user has not accepted the terms and conditions; return false. */
            if (!termsAcceptedDate) return false;

            termsAcceptedDate = moment.utc(termsAcceptedDate);

            return termsAcceptedDate.isAfter(termsDate);
        }
    };
}
