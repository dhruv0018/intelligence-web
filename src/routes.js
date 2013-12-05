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

            .state('404', {
                url: '/404',
                parent: 'root',
                public: true,
                views: {
                    'main@': {
                        template: '<div class="jumbotron"><h1 class="alert alert-info">Not Found</h1></div>',
                    }
                }
            })

            .state('500', {
                url: '/500',
                parent: 'root',
                public: true,
                views: {
                    'main@': {
                        template: '<div class="jumbotron"><h1 class="alert alert-danger">Server Error</h1></div>',
                    }
                }
            })

            .state('501', {
                url: '/501',
                parent: 'root',
                public: true,
                views: {
                    'main@': {
                        template: '<div class="jumbotron"><h1 class="alert alert-warning">Not Implemented</h1></div>',
                    }
                }
            })

            .state('error', {
                url: '/error',
                parent: 'root',
                public: true,
                views: {
                    'main@': {
                        template: '<div class="jumbotron"><h1 class="alert alert-danger">Error</h1></div>',
                    }
                }
            });
    }
]);

IntelligenceWebClient.run([
    '$rootScope', '$http', '$location', '$state', '$stateParams', 'TokensService', 'AuthenticationService',
    function run($rootScope, $http, $location, $state, $stateParams, tokens, auth) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeStart', function(event, to, toParams, from, fromParams) {

            $rootScope.isLoggedIn = auth.isLoggedIn;

            /* If not accessing a public state and not logged in, then
             * redirect the user to login. */
            if (!to.public && !auth.isLoggedIn) {

                event.preventDefault();
                $state.go('login');
            }

            /* Check to see if the OAuth tokens have been set, if so then
             * use the access token in the authorization header. */
            if (tokens.areTokensSet()) {

                $http.defaults.headers.common.Authorization = 'Bearer ' + tokens.getAccessToken();
            }
        });
    }
]);

