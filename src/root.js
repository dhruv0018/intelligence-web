var IntelligenceWebClient = require('./app');

IntelligenceWebClient.run(function($rootScope, $window){

    angular.element($window).bind('resize',function(){

        var resize = {

            width: $window.outerWidth
        };

        $rootScope.$broadcast('resize', resize);
    });
});

/**
 * Root controller.
 * @module IntelligenceWebClient
 * @name RootController
 * @type {Controller}
 */
IntelligenceWebClient.controller('RootController', [
    '$scope', '$state', 'SessionService', 'AuthenticationService',
    function controller($scope, $state, session, auth) {

        if (auth.isLoggedIn) {

            $scope.currentUser = session.retrieveCurrentUser();
        }
    }
]);
