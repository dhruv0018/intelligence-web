var IntelligenceWebClient = require('./app');

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
                url: '/',
                template: '<h1>ROOT</h1>',
                public: true
            })

            .state('index', {
                url: '/index',
                template: '<h1>INDEX</h1>',
                public: true
            })

            .state('test', {
                url: '/test',
                template: '<h1>TEST</h1><p><a ui-sref="index">Index</a></p><p><a ui-sref="private">Private</a></p>',
                public: true
            })

            .state('private', {
                url: '/private',
                template: '<h1>Private</h1>',
                public: false
            })

            .state('locked', {
                url: '/locked',
                template: '<h1>Locked</h1>',
            })

            .state('404', {
                url: '/404',
                template: '<h1>Not Found</h1>',
                public: true
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
            if (!to.public && !AuthenticationService.isLoggedIn()) {

                event.preventDefault();
                $location.path('/login');
            }
        });
    }
]);

