/* Fetch angular from the browser scope */
const angular = window.angular;
const AthleteProfileAboutTemplateUrl = 'app/athlete/profile/about/template.html';

import AthleteProfileAboutController from './controller';
/**
 * About page module.
 * @module About
 */
const About = angular.module('Athlete.Profile.About', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);


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
                    templateUrl: AthleteProfileAboutTemplateUrl,
                    controller: AthleteProfileAboutController
                }
            }
        });
    }
]);
