import UpdatedTermsAndConditionsController from './controller.js';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Terms and Conditions Acceptance State module for managing users needing to
 * re-accept the Terms and Conditions.
 * @module UpdatedTermsAndConditions
 */
const UpdatedTermsAndConditions = angular.module('UpdatedTermsAndConditions', [
    'ui.router',
    'ui.bootstrap'
]);

const TermsTemplateUrl = 'app/updated-terms-and-conditions/template.html';

/**
 * Terms And Conditions state router. Router for the re-accepting of the Terms
 * and Conditions. Uses AngularUI UI-Router.
 * @module UpdatedTermsAndConditions
 * @type {UI-Router}
 */

UpdatedTermsAndConditions.config([
    '$stateProvider',
    function config(
        $stateProvider
    ) {

        $stateProvider
        .state('UpdatedTermsAndConditions', {

            url: '/updated-terms-and-conditions',
            views: {

                'root': {

                    templateUrl: TermsTemplateUrl,
                    controller: UpdatedTermsAndConditionsController
                }
            }
        });
    }
]);
