/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile.About page module.
 * @module Profile.About
 */
var About = angular.module('Athlete.Profile.About');

/**
 * Profile.About page state router.
 * @module Profile.About
 * @type {UI-Router}
 */
About.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.About', {
            views: {
                'about@Athlete.Profile': {
                    templateUrl: 'athlete/profile/about/template.html',
                    controller: 'Athlete.Profile.About.controller'
                }
            }
        });
    }
]);
