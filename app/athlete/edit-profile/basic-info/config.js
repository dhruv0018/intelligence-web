/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.BasicInfo page module.
 * @module EditProfile.BasicInfo
 */
var BasicInfo = angular.module('Athlete.EditProfile.BasicInfo');

/**
 * EditProfile.BasicInfo page state router.
 * @module EditProfile.BasicInfo
 * @type {UI-Router}
 */
BasicInfo.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.EditProfile.BasicInfo', {
            views: {
                'basic-info@Athlete.EditProfile': {
                    templateUrl: 'athlete/edit-profile/basic-info/template.html',
                    controller: 'Athlete.EditProfile.BasicInfo.controller'
                }
            }
        });
    }
]);
