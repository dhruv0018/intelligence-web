/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Achievements page module.
 * @module EditProfile.Achievements
 */
var Achievements = angular.module('Athlete.Profile.EditProfile.Achievements');

/**
 * EditProfile.Achievements page state router.
 * @module EditProfile.Achievements
 * @type {UI-Router}
 */
Achievements.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.EditProfile.Achievements', {
            views: {
                'content@Athlete.Profile.EditProfile': {
                    templateUrl: 'athlete/edit-profile/achievements/template.html',
                    controller: 'Athlete.Profile.EditProfile.Achievements.controller'
                }
            }
        });
    }
]);
