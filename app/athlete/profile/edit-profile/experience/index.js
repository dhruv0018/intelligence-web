/* Fetch angular from the browser scope */
const angular = window.angular;

const AthleteProfileEditProfileExperienceTemplateUrl = 'app/athlete/profile/edit-profile/experience/template.html';

import AthleteProfileEditProfileExperienceController from './controller';
/**
 * Experience page module.
 * @module Experience
 */
const Experience = angular.module('Athlete.Profile.EditProfile.Experience', [
    'ui.router',
    'ui.bootstrap',
    'no-results'
]);

/**
 * EditProfile.Experience page state router.
 * @module EditProfile.Experience
 * @type {UI-Router}
 */
Experience.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.EditProfile.Experience', {
            views: {
                'content@Athlete.Profile.EditProfile': {
                    templateUrl: AthleteProfileEditProfileExperienceTemplateUrl,
                    controller: AthleteProfileEditProfileExperienceController
                }
            }
        });
    }
]);
