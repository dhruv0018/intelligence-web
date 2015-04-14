/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Academics page module.
 * @module EditProfile.Academics
 */
var Academics = angular.module('Athlete.Profile.EditProfile.Academics');

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
                    templateUrl: 'athlete/edit-profile/academics/template.html',
                    controller: 'Athlete.Profile.EditProfile.Academics.controller'
                }
            }
        });
    }
]);
