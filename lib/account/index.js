/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Account page module.
 * @module Account
 */
var Account = angular.module('account', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Account.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('account.html', template);
    }
]);

/**
 * Account page state router.
 * @module Account
 * @type {UI-Router}
 */
Account.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('account', {
                url: '/account',
                parent: 'base',
                views: {
                    'main@': {
                        templateUrl: 'account.html',
                        controller: 'AccountController'
                    }
                }
            });
    }
]);

/**
 * Account controller.
 * @module Account
 * @name AccountController
 * @type {Controller}
 */
Account.controller('AccountController', [
    '$scope', 'SessionService', 'ROLES',
    function controller($scope, session, ROLES) {

        $scope.COACH = ROLES.COACH;
        $scope.PARENT = ROLES.PARENT;
        $scope.ATHLETE = ROLES.ATHLETE;
        $scope.INDEXER = ROLES.INDEXER;

        $scope.currentUser = session.currentUser;
    }
]);

