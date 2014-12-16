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

IntelligenceWebClient.value('$previousState', {});

IntelligenceWebClient.run([
    'ANONYMOUS_USER', '$rootScope', '$urlRouter', '$state', '$stateParams', '$previousState', 'TokensService', 'AuthenticationService', 'AuthorizationService', 'SessionService', 'AlertsService', 'ResourceManager',
    function run(ANONYMOUS_USER, $rootScope, $urlRouter, $state, $stateParams, $previousState, tokens, auth, authz, session, alerts, managedResources) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            /* If the user is accessing a public state. */
            if (authz.isPublic(toState)) {

                /* If not logged in. */
                if (!auth.isLoggedIn) {

                    /* Store the user in the session. */
                    session.storeCurrentUser(ANONYMOUS_USER);

                    /* Retrieve the user from the session. */
                    var currentUser = session.retrieveCurrentUser();

                    /* Expose the current user on the root scope. */
                    $rootScope.currentUser = currentUser;
                }

                /* It there is no access token set. */
                if (!tokens.getAccessToken()) {

                    /* Prevent the state from loading. */
                    event.preventDefault();

                    /* Request client tokens. */
                    tokens.requestClientTokens()

                    /* If the tokens request is successful. */
                    .then(function(authTokens) {

                        /* Set the tokens. */
                        tokens.setTokens(authTokens);
                    })

                    /* In any case, finally. */
                    .finally(function() {

                        /* Go to state, but without starting state transition again. */
                        $state.go(toState.name, toParams, {notify: false}).then(function() {

                            /* Broadcast the success of the state transition. */
                            $rootScope.$broadcast('$stateChangeSuccess', toState, toParams, fromState, fromParams);
                        });
                    });
                }
            }

            /* If not accessing a public state and not logged in, then
             * redirect the user to login. */
            else if (!auth.isLoggedIn) {

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

            /* Store previous state */
            $previousState = from;
        });

        $rootScope.$on('roleChangeSuccess', function(event, role) {

            /* Ensure the current user still has access to the current state. */
            if (!authz.isAuthorized($state.current)) {

                $state.go('Account.ContactInfo');
            }
        });
    }
]);

