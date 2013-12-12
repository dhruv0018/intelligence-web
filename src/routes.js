var IntelligenceWebClient = require('./app');

require('./services/authentication');

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
            })

            .state('500', {
                url: '/500',
                parent: 'root',
                views: {
                    'main@root': {
                        template: '<div class="jumbotron"><h1 class="alert alert-danger">Server Error</h1></div>',
                    }
                }
            })

            .state('501', {
                url: '/501',
                parent: 'root',
                views: {
                    'main@root': {
                        template: '<div class="jumbotron"><h1 class="alert alert-warning">Not Implemented</h1></div>',
                    }
                }
            })

            .state('error', {
                url: '/error',
                parent: 'root',
                views: {
                    'main@root': {
                        template: '<div class="jumbotron"><h1 class="alert alert-danger">Error</h1></div>',
                    }
                }
            });
    }
]);

IntelligenceWebClient.run([
    '$rootScope', '$http', '$location', '$state', '$stateParams', 'TokensService', 'AuthenticationService', 'AuthorizationService',
    function run($rootScope, $http, $location, $state, $stateParams, tokens, auth, authz) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeStart', function(event, to, toParams, from, fromParams) {

            /* If not accessing a public state and not logged in, then
             * redirect the user to login. */
            if (!authz.isPublic(to) && !auth.isLoggedIn) {

                event.preventDefault();
                $state.go('login');
            }

            /* Ensure the current user has access to the route. */
            else if (!authz.isAuthorized(to)) {

                event.preventDefault();
                $state.go('401');
            }

            /* Check to see if the OAuth tokens have been set, if so then
             * use the access token in the authorization header. */
            if (tokens.areTokensSet()) {

                $http.defaults.headers.common.Authorization = 'Bearer ' + tokens.getAccessToken();
            }
        });

        $rootScope.$on('roleChangeSuccess', function(event, role) {

            /* Ensure the current user still has access to the current state. */
            if (!authz.isAuthorized($state.current)) {

                $state.go('401');
            }
        });
    }
]);

