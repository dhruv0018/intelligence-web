/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Achievements page module.
 * @module EditProfile.Achievements
 */
var Achievements = angular.module('Athlete.EditProfile.Achievements');

/**
 * EditProfile.Achievements page state router.
 * @module EditProfile.Achievements
 * @type {UI-Router}
 */
Achievements.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.EditProfile.Achievements', {
            views: {
                'achievements@Athlete.EditProfile': {
                    templateUrl: 'athlete/edit-profile/achievements/template.html',
                    controller: 'Athlete.EditProfile.Achievements.controller'
                }
            }
        });
    }
]);
