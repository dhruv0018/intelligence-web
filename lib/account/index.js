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
                public: false,
                url: '/account',
                views: {
                    'header': {
                        templateUrl: 'header.html',
                        controller: 'HeaderController'
                    },
                    'main': {
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
    '$rootScope', '$scope', '$state', 'Users',
    function controller($rootScope, $scope, $state, users) {

        var user = $rootScope.currentUser;

        $scope.name = user.firstName + ' ' + user.lastName;

        /* TODO: This is just for demo. Once account types are defined this
         * should check all roles for the super admin ID. */
        $scope.isSuperAdmin = user.roles[0].roleType.id === 1;
    }
]);

