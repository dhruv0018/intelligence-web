const angular = window.angular;

import AccountController from './controller';
import ContactInfoController from './contact-info/controller';
import PlansAndPackagesController from './plans-and-packages/controller';

/* Template paths */
const AccountTemplateUrl = 'app/account/template.html';
const ContactInfoTemplateUrl = 'app/account/contact-info/template.html';
const TermsAndConditionsTemplateUrl = 'app/account/terms-and-conditions/template.html';
const PlansAndPackagesTemplateUrl = 'app/account/plans-and-packages/template.html';

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
            },
            resolve: {
                    'Account.Data': [
                        '$q',
                        'TeamsFactory',
                        'v3ProductsFactory',
                        'SessionService',
                        'ROLES',
                        function(
                            $q,
                            teams,
                            v3ProductsFactory,
                            session,
                            ROLES
                        ) {
                            let data = {};
                            if(session.currentUser.is(ROLES.COACH)) {
                                let teamId = session.getCurrentRole().teamId;
                                data.remainingBreakdowns = teams.getRemainingBreakdowns(teamId).then(breakdownData => {
                                    session.currentUser.remainingBreakdowns = breakdownData;
                                    return breakdownData;
                                });
                                data.teams = teams.load(teamId);
                                data.products = data.teams.then(teamsResponse => {
                                    let currentUserTeam = teams.get(teamId);
                                    let productsFilter = {teamId};
                                    productsFilter['filter[sportId]'] = currentUserTeam.getSport().id;
                                    productsFilter['filter[productFamily]'] = 'breakdown package';
                                    return v3ProductsFactory.load(productsFilter);
                                });
                            }

                            return $q.all(data);
                        }
                    ]
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
        })

        .state('Account.PlansAndPackages', {

            parent: 'Account',
            url: '',
            views: {

                'content@Account': {

                    templateUrl: PlansAndPackagesTemplateUrl,
                    controller: PlansAndPackagesController
                }
            }
        });
    }
]);
