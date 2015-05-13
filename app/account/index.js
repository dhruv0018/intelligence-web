/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Account page module.
 * @module Account
 */
var Account = angular.module('Account', [
    'ui.router',
    'ui.bootstrap',
    'ui.validate'
]);

/* Cache the template file */
Account.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('account/template.html', require('./template.html'));
        $templateCache.put('account/contact-info.html', require('./contact-info.html'));
        $templateCache.put('account/roles-list.html', require('./roles-list.html'));
        $templateCache.put('account/terms-and-conditions.html', require('./terms-and-conditions.html'));
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

            .state('Account', {
                url: '/account',
                parent: 'base',
                abstract: true,
                views: {
                    'main@root': {
                        templateUrl: 'account/template.html',
                        controller: 'Account.controller'
                    }
                }
            })

            .state('Account.ContactInfo', {
                url: '',
                parent: 'Account',
                views: {
                    'content@Account': {
                        templateUrl: 'account/contact-info.html',
                        controller: 'Account.ContactInfo.controller'
                    }
                }
            })

            .state('Account.TermsAndConditions', {
                url: '',
                parent: 'Account',
                views: {
                    'content@Account': {
                        templateUrl: 'account/terms-and-conditions.html'
                    }
                }
            })

            .state('Account.RolesList', {
                url: '',
                parent: 'Account',
                views: {
                    'content@Account': {
                        templateUrl: 'account/roles-list.html',
                        controller: 'Account.RolesList.controller'
                    }
                }
            });
    }
]);

/**
 * Account controller.
 * @module Account
 * @name Account.controller
 * @type {controller}
 */
Account.controller('Account.controller', [
    function controller() {

    }
]);

/* File dependencies. */
require('./contact-info');
require('./roles-list');
