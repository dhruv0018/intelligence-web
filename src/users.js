var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.run([
    '$rootScope', 'AuthenticationService', 'SessionService',
    function run($rootScope, auth, session) {

        /* Store the current user if logged in. */
        if (auth.isLoggedIn) {

            /* Retrieve the current user. */
            var currentUser = session.retrieveCurrentUser();

            /* Retrieve the previous user. */
            var previousUser = session.retrievePreviousUser();

            /* Store the current user. */
            session.storeCurrentUser(currentUser);
            session.storePreviousUser(previousUser);

            /* Expose the current user on the root scope. */
            $rootScope.currentUser = currentUser;
        }
    }
]);

