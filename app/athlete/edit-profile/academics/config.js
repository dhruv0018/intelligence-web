/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * EditProfile.Academics page module.
 * @module EditProfile.Academics
 */
var Academics = angular.module('Athlete.EditProfile.Academics');

/**
 * EditProfile.Academics page state router.
 * @module EditProfile.Academics
 * @type {UI-Router}
 */
Academics.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.EditProfile.Academics', {
            views: {
                'content@Athlete.EditProfile': {
                    templateUrl: 'athlete/edit-profile/academics/template.html',
                    controller: 'Athlete.EditProfile.Academics.controller'
                }
            }
        });
    }
]);
