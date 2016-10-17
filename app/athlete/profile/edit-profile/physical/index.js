/* Fetch angular from the browser scope */
const angular = window.angular;

const AthleteProfileEditProfilePhysicalTemplateUrl = 'app/athlete/profile/edit-profile/physical/template.html';

import AthleteProfileEditProfilePhysicalController from './controller';

/**
 * Physical page module.
 * @module Physical
 */
const Physical = angular.module('Athlete.Profile.EditProfile.Physical', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

/**
 * EditProfile.Physical page state router.
 * @module EditProfile.Physical
 * @type {UI-Router}
 */
Physical.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.EditProfile.Physical', {
            views: {
                'content@Athlete.Profile.EditProfile': {
                    templateUrl: AthleteProfileEditProfilePhysicalTemplateUrl,
                    controller: AthleteProfileEditProfilePhysicalController
                }
            }
        });
    }
]);
