/* Fetch angular from the browser scope */
const angular = window.angular;
const EditProfileAcademicsTemplateUrl = 'app/athlete/profile/edit-profile/academics/template.html';

import AthleteProfileEditProfileAcademicsController from './controller';

/**
 * Academics page module.
 * @module Academics
 */
const Academics = angular.module('Athlete.Profile.EditProfile.Academics', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);


/**
 * EditProfile.Academics page state router.
 * @module EditProfile.Academics
 * @type {UI-Router}
 */
Academics.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.EditProfile.Academics', {
            views: {
                'content@Athlete.Profile.EditProfile': {
                    templateUrl: EditProfileAcademicsTemplateUrl,
                    controller: AthleteProfileEditProfileAcademicsController
                }
            }
        });
    }
]);
