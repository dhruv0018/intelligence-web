/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Header
 * @module IntelligenceWebClient
 */
var IntelligenceWebClient = angular.module('intelligence-web-client');

IntelligenceWebClient.run(function($rootScope, $window){

    angular.element($window).bind('resize',function(){

        var resize = {

            width: $window.outerWidth
        };

        $rootScope.$broadcast('resize', resize);
    });
});

/* Cache the template file */
IntelligenceWebClient.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('root.html', template);
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
                        templateUrl: 'root.html',
                        controller: 'RootController'
                    }
                }
            });
    }
]);

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
