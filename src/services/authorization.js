var WILDCARD = '*';

var IntelligenceWebClient = require('../app');

var routes = require('../../config/routes.json');

/**
 * A service to manage allowing users access to specific portions of the site.
 * @module IntelligenceWebClient
 * @name AuthorizationService
 * @type {service}
 */
IntelligenceWebClient.service('AuthorizationService', [
    '$state', 'ROLE_ID', 'ROLES', 'SessionService',
    function($state, ROLE_ID, ROLES, session) {

        return {

            /**
             * Verifies if a route is defined as public.
             * @param {UIState} to - a UI-Router state object
             * @return true if the route is public.
             */
            isPublic: function(to) {

                /* Lookup the route by name. */
                var route = routes[to.name];

                /* Assert that the route is defined. */
                if (!route) return false;

                /* Consider authorized if the route is accessible to anyone. */
                return route[WILDCARD] ? true : false;
            },

            /**
             * Ensures that the current user, in their current role, is
             * authorized to access the given route.
             * @param {UIState} to - a UI-Router state object
             * @return true if the user is authorized to access the route.
             */
            isAuthorized: function(to) {

                /* Consider authorized if the route is accessible to publicly. */
                if (this.isPublic(to)) return true;

                /* Lookup the route by name. */
                var route = routes[to.name];

                /* Assert that the route is defined. */
                if (!route) return false;

                /* If the route is not openly accessible, then check if the
                 * current user has access... */

                /* Get the current user. */
                var currentUser = session.retrieveCurrentUser();

                /* Ensure the current user is in the session. */
                if (!currentUser) return false;

                /* Get the current users current role. */
                var currentRole = currentUser.currentRole;

                /* Ensure the current role is set for the current user. */
                if (!currentRole || !currentRole.type) return false;

                /* Match the current role based on ID from the server. */
                var role = ROLES[ROLE_ID[currentRole.type.id]];

                /* Check if the route can be accessed by the currentRole... */

                if (!role) return false;

                /* Match the role name from the route file with the role name
                 * from the roles constant lookup. */
                return route[role.type.name];
            }
        };
    }
]);

