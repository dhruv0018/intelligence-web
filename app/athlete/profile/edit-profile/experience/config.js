/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Experience page module.
 * @module EditProfile.Achievements
 */
var Experience = angular.module('Athlete.Profile.EditProfile.Experience');

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
                    templateUrl: 'athlete/edit-profile/experience/template.html',
                    controller: 'Athlete.Profile.EditProfile.Experience.controller'
                }
            }
        });
    }
]);
