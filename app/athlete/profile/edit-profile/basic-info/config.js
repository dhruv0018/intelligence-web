/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/edit-profile/basic-info/template.html';

/**
 * EditProfile.BasicInfo page module.
 * @module EditProfile.BasicInfo
 */
const BasicInfo = angular.module('Athlete.Profile.EditProfile.BasicInfo');

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
                    templateUrl: templateUrl,
                    controller: 'Athlete.Profile.EditProfile.BasicInfo.controller'
                }
            }
        });
    }
]);
