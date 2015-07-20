/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/profile/academics/template.html';

/**
 * Profile.Academics page module.
 * @module Profile.Academics
 */
const Academics = angular.module('Athlete.Profile.Academics');

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
                    templateUrl: templateUrl,
                    controller: 'Athlete.Profile.Academics.controller'
                }
            }
        });
    }
]);
