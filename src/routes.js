var IntelligenceWebClient = require('./app');

require('./services/authentication');

IntelligenceWebClient.config([
    '$locationProvider',
    function config($locationProvider) {

        $locationProvider.html5Mode(true);
    }
]);

IntelligenceWebClient.config([
    '$urlRouterProvider',
    function config($urlRouterProvider) {

        $urlRouterProvider

            .when('', '/')

            .otherwise('/404');
    }
]);

IntelligenceWebClient.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

            .state('root', {
                url: '',
                abstract: true,
                views: {
                    'root': {
                        template: '<ui-view/>',
                        controller: 'RootController'
                    }
                }
            })

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
    '$rootScope', '$location', '$state', '$stateParams', 'AuthenticationService',
    function run($rootScope, $location, $state, $stateParams, AuthenticationService) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on('$stateChangeStart', function(event, to, toParams, from, fromParams) {

            /* If not accessing a public state and not logged in, then
             * redirect the user to login.
             */
            if (!to.public && !AuthenticationService.isLoggedIn) {

                event.preventDefault();
                $location.path('/login');
            }
        });
    }
]);

