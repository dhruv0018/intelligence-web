/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Physical page module.
 * @module EditProfile.Physical
 */
var Physical = angular.module('Athlete.Profile.EditProfile.Physical');

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
                    templateUrl: 'athlete/edit-profile/physical/template.html',
                    controller: 'Athlete.Profile.EditProfile.Physical.controller'
                }
            }
        });
    }
]);
