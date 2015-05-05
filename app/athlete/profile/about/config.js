/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/profile/about/template.html';

/**
 * Profile.About page module.
 * @module Profile.About
 */
const About = angular.module('Athlete.Profile.About');

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
                    templateUrl: templateUrl,
                    controller: 'Athlete.Profile.About.controller'
                }
            }
        });
    }
]);
