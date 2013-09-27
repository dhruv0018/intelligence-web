var IntelligenceWebClient = require('./app');

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

