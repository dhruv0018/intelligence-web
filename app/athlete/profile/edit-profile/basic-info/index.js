/* Fetch angular from the browser scope */
const angular = window.angular;
const AthleteProfileEditProfileBasciInfoTemplateUrl = 'app/athlete/profile/edit-profile/basic-info/template.html';

import AthleteProfileEditProfileBasicInfoController from './controller';
/**
 * BasicInfo page module.
 * @module BasicInfo
 */
const BasicInfo = angular.module('Athlete.Profile.EditProfile.BasicInfo', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);


/**
 * EditProfile.BasicInfo page state router.
 * @module EditProfile.BasicInfo
 * @type {UI-Router}
 */
BasicInfo.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.EditProfile.BasicInfo', {
            url: '',
            views: {
                'content@Athlete.Profile.EditProfile': {
                    templateUrl: AthleteProfileEditProfileBasciInfoTemplateUrl,
                    controller: AthleteProfileEditProfileBasicInfoController
                }
            }
        });
    }
]);
