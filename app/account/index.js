/* Fetch angular from the browser scope */
const angular = window.angular;

/* Templates */

const accountTemplate               = require('./template.html');
const accountTemplateUrl            = 'account/template.html';
const contactInfoTemplate           = require('./contact-info.html');
const contactInfoTemplateUrl        = 'account/contact-info.html';
const rolesListTemplate             = require('./roles-list.html');
const rolesListTemplateUrl          = 'account/roles-list.html';
const termsAndConditionsTemplate    = require('./terms-and-conditions.html');
const termsAndConditionsTemplateUrl = 'account/terms-and-conditions.html';

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

        $templateCache.put(accountTemplateUrl, accountTemplate);
        $templateCache.put(contactInfoTemplateUrl, contactInfoTemplate);
        $templateCache.put(rolesListTemplateUrl, rolesListTemplate);
        $templateCache.put(termsAndConditionsTemplateUrl, termsAndConditionsTemplate);
    }
]);

/**
 * Account page state router.
 * @module Account
 * @type {UI-Router}
 */
Account.config([
    '$stateProvider',
    '$urlRouterProvider',
    function config(
        $stateProvider,
        $urlRouterProvider
    ) {

        $stateProvider
        .state('Account', {

            url: '/account',
            parent: 'base',
            abstract: true,
            defaultChild: 'Account.ContactInfo',
            views: {

                'main@root': {

                    templateUrl: accountTemplateUrl,
                    controller: 'Account.controller'
                }
            }
        })

        .state('Account.ContactInfo', {

            parent: 'Account',
            url: '',
            views: {

                'content@Account': {

                    templateUrl: contactInfoTemplateUrl,
                    controller: 'Account.ContactInfo.controller'
                }
            }
        })

        .state('Account.TermsAndConditions', {

            parent: 'Account',
            url: '',
            views: {

                'content@Account': {

                    templateUrl: termsAndConditionsTemplateUrl
                }
            }
        })

        .state('Account.RolesList', {

            parent: 'Account',
            views: {

                'content@Account': {

                    templateUrl: rolesListTemplateUrl,
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
