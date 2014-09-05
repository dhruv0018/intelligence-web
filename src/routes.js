var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.config([
    '$locationProvider',
    function config($locationProvider) {

        $locationProvider.html5Mode(true);
    }
]);

IntelligenceWebClient.run([
    '$rootScope', '$http', '$location', '$state', '$stateParams', 'TokensService', 'AuthenticationService', 'AuthorizationService', 'SessionService', 'AlertsService', 'ResourceManager',
    function run($rootScope, $http, $location, $state, $stateParams, tokens, auth, authz, session, alerts, managedResources) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        /* Retrieve the current user. */
        var currentUser = session.retrieveCurrentUser();

        /* Expose the current user on the root scope. */
        $rootScope.currentUser = currentUser;

        /* Store the current user if logged in. */
        if (auth.isLoggedIn) {

            /* Store the current user. */
            session.storeCurrentUser(currentUser);
        }

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            /* If not accessing a public state and not logged in, then
             * redirect the user to login. */
            if (!authz.isPublic(toState) && !auth.isLoggedIn) {

                /* Prevent the state from loading. */
                event.preventDefault();

                /* Redirect the user to the login page. */
                $state.go('login');
            }

            /* Ensure the current user has access to the route. */
            else if (!authz.isAuthorized(toState)) {

                /* Prevent the state from loading. */
                event.preventDefault();

                alerts.add({
                    type: 'info',
                    message: 'You do not have permission to go to ' + toState.name
                });
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {

            /* Clear any alerts. */
            alerts.clear();

            /* Restore any active resources to their backups. */
            managedResources.restore();
        });

        $rootScope.$on('roleChangeSuccess', function(event, role) {

            /* Ensure the current user still has access to the current state. */
            if (!authz.isAuthorized($state.current)) {

                $state.go('Account.ContactInfo');
            }
        });
    }
]);

