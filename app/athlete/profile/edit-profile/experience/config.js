/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/edit-profile/experience/template.html';

/**
 * EditProfile.Experience page module.
 * @module EditProfile.Achievements
 */
const Experience = angular.module('Athlete.Profile.EditProfile.Experience');

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
                    templateUrl: templateUrl,
                    controller: 'Athlete.Profile.EditProfile.Experience.controller'
                }
            }
        });
    }
]);
