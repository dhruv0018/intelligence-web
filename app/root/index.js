/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Root module
 * @module Root
 */
var Root = angular.module('root', []);

Root.run([
    '$rootScope', '$window',
    function run($rootScope, $window) {

        angular.element($window).bind('resize',function() {

            var resize = {

                width: $window.outerWidth
            };

            $rootScope.$broadcast('resize', resize);
        });
    }
]);

/* Cache the template file */
Root.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('root.html', template);
    }
]);

Root.config([
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
                },
                resolve: {
                    'Root.Data': 'Root.Data'
                }
            });
    }
]);

/**
 * Root controller.
 * @module Root
 * @name RootController
 * @type {Controller}
 */
Root.controller('RootController', [
    '$scope', '$state', 'SessionService', 'AuthenticationService',
    function controller($scope, $state, session, auth) {

        if (auth.isLoggedIn) {

            $scope.currentUser = session.retrieveCurrentUser();
        }
    }
]);


Root.service('Root.Data', [
    '$q', 'SportsFactory',
    function($q, sports) {
        var promisedSports = $q.defer();

        sports.getList({
        }, function(sports) {
            promisedSports.resolve(sports);
        });

        var promises = {
            sports: promisedSports.promise
        };

        return promises;
    }
]);

