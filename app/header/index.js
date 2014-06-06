/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Header
 * @module Header
 */
var Header = angular.module('header', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Header.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('header.html', template);
    }
]);

/**
 * Header state router.
 * @module Header
 * @type {UI-Router}
 */
Header.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('base', {
                url: '',
                parent: 'root',
                abstract: true,
                views: {
                    'header@root': {
                        templateUrl: 'header.html',
                        controller: 'HeaderController'
                    }
                },
                resolve: {
                    'Base.Data': [
                        '$q', 'Base.Data',
                        function($q, data) {
                            return $q.all(data);
                        }
                    ]
                }
            });
    }
]);


Header.service('Base.Data', [
    '$q', 'SportsFactory',
    function($q, sports) {

        var promisedSports = $q.defer();

        sports.getList({
        }, function(sports) {
            promisedSports.resolve(sports);
        }, null, true);

        var promises = {
            sports: promisedSports.promise
        };

        return promises;
    }
]);


/**
 * Header controller.
 * @module Header
 * @name HeaderController
 * @type {Controller}
 */
Header.controller('HeaderController', [
    'config', '$scope', '$state', 'AuthenticationService', 'SessionService', 'AccountService', 'ROLES', 'Coach.Game.Tabs',
    function controller(config, $scope, $state, auth, session, account, ROLES, tabs) {

        $scope.SUPER_ADMIN = ROLES.SUPER_ADMIN;
        $scope.ADMIN = ROLES.ADMIN;
        $scope.INDEXER = ROLES.INDEXER;
        $scope.COACH = ROLES.COACH;

        $scope.config = config;

        $scope.$state = $state;

        $scope.currentUser = session.currentUser;

        $scope.account = account;

        $scope.logout = function() {

            auth.logoutUser();
            $state.go('login');
        };

        $scope.tabs = tabs;
    }
]);

