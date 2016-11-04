/* Fetch angular from the browser scope */
const angular = window.angular;
const AthleteEditProfileContactTemplateUrl = 'app/athlete/profile/edit-profile/contact/template.html';

import AthleteProfileEditProfileContactController from './controller';

/**
 * Contact page module.
 * @module Contact
 */
const Contact = angular.module('Athlete.Profile.EditProfile.Contact', [
    'ui.router',
    'ui.bootstrap',
    'no-results'
]);

/**
 * EditProfile.Contact page state router.
 * @module EditProfile.Contact
 * @type {UI-Router}
 */
Contact.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.EditProfile.Contact', {
            views: {
                'content@Athlete.Profile.EditProfile': {
                    templateUrl: AthleteEditProfileContactTemplateUrl,
                    controller: AthleteProfileEditProfileContactController
                }
            }
        });
    }
]);
