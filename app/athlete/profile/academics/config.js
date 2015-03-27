/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile.Academics page module.
 * @module Profile.Academics
 */
var Academics = angular.module('Athlete.Profile.Academics');

/**
 * Profile.Academics page state router.
 * @module Profile.Academics
 * @type {UI-Router}
 */
Academics.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.Academics', {
            views: {
                'academics@Athlete.Profile': {
                    templateUrl: 'athlete/profile/academics/template.html',
                    controller: 'Athlete.Profile.Academics.controller'
                }
            }
        });
    }
]);
