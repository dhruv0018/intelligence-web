const angular = window.angular;

import AccountController from './controller';
import ContactInfoController from './contact-info/controller';

/* Template paths */
const AccountTemplateUrl = 'app/account/template.html';
const ContactInfoTemplateUrl = 'app/account/contact-info/template.html';
const TermsAndConditionsTemplateUrl = 'app/account/terms-and-conditions/template.html';

/**
 * Account page module.
 * @module Account
 */
var Account = angular.module('Account', [
    'ui.router',
    'ui.bootstrap',
    'ui.validate'
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

                    templateUrl: AccountTemplateUrl,
                    controller: AccountController
                }
            }
        })

        .state('Account.ContactInfo', {

            parent: 'Account',
            url: '',
            views: {

                'content@Account': {

                    templateUrl: ContactInfoTemplateUrl,
                    controller: ContactInfoController
                }
            }
        })

        .state('Account.TermsAndConditions', {

            parent: 'Account',
            url: '',
            views: {

                'content@Account': {

                    templateUrl: TermsAndConditionsTemplateUrl
                }
            }
        });
    }
]);
