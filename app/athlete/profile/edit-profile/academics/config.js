/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/edit-profile/academics/template.html';

/**
 * EditProfile.Academics page module.
 * @module EditProfile.Academics
 */
const Academics = angular.module('Athlete.Profile.EditProfile.Academics');

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
                    templateUrl: templateUrl,
                    controller: 'Athlete.Profile.EditProfile.Academics.controller'
                }
            }
        });
    }
]);
