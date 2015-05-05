/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/edit-profile/physical/template.html';

/**
 * EditProfile.Physical page module.
 * @module EditProfile.Physical
 */
const Physical = angular.module('Athlete.Profile.EditProfile.Physical');

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
                    templateUrl: templateUrl,
                    controller: 'Athlete.Profile.EditProfile.Physical.controller'
                }
            }
        });
    }
]);
