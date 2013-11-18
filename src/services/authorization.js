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
    '$state', 'ROLES', 'SessionService', 'UsersFactory',
    function($state, ROLES, session, users) {

        return {

            /**
             * Ensures that the current user, in their current role, is
             * authorized to access the given route.
             * @param {UIState} to - a UI-Router state object
             * @return true if the user is authorized to access the route.
             */
            isAuthorized: function(to) {

                /* Lookup the route by name. */
                var route = routes[to.name];

                /* Assert that the route is defined. */
                if (!route) return false;

                /* Ensure the current user is in the session. */
                if (!session.currentUser) return false;

                /* Get the current users current role. */
                var currentRole = session.currentUser.currentRole;

                /* Ensure the current role is set for the current user. */
                if (!currentRole || !currentRole.type) return false;

                /* Get the current roles name. */
                var roleName = currentRole.type.name.toLowerCase();

                /* Check if the route can be accessed by the currentRole. */
                return route[WILDCARD] || route[roleName];
            }
        }
    }
]);

