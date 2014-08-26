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

IntelligenceWebClient.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

            .state('401', {
                url: '/401',
                parent: 'root',
                views: {
                    'main@root': {
                        template: '<div class="jumbotron"><h1 class="alert alert-danger">Not Authorized</h1></div>',
                    }
                }
            })

            .state('404', {
                url: '/404',
                parent: 'root',
                views: {
                    'main@root': {
                        template: '<div class="jumbotron"><h1 class="alert alert-info">Not Found</h1></div>',
                    }
                }
            });
    }
]);

IntelligenceWebClient.run([
    '$rootScope', '$http', '$location', '$state', '$stateParams', 'TokensService', 'AuthenticationService', 'AuthorizationService', 'SessionService', 'AlertsService', 'ResourceManager',
    function run($rootScope, $http, $location, $state, $stateParams, tokens, auth, authz, session, alerts, managedResources) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            /* Retrieve the current user. */
            var currentUser = session.retrieveCurrentUser();

            /* Expose the current user on the root scope. */
            $rootScope.currentUser = currentUser;

            /* Store the current user if logged in. */
            if (auth.isLoggedIn) {

                /* Store the current user. */
                session.storeCurrentUser(currentUser);
            }

            /* If not accessing a public state and not logged in, then
             * redirect the user to login. */
            if (!authz.isPublic(toState) && !auth.isLoggedIn) {

                event.preventDefault();
                $state.go('login');
            }

            /* Ensure the current user has access to the route. */
            else if (!authz.isAuthorized(toState)) {

                event.preventDefault();
                $state.go('login');
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

