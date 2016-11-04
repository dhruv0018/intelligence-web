/* Fetch angular from the browser scope */
const angular = window.angular;
const AthleteProfileAcademicsTemplateUrl = 'app/athlete/profile/academics/template.html';

import AthleteProfileAcademicsController from './controller';
/**
 * Academics page module.
 * @module Academics
 */
const Academics = angular.module('Athlete.Profile.Academics', [
    'ui.router',
    'ui.bootstrap',
    'no-results'
]);

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
                    templateUrl: AthleteProfileAcademicsTemplateUrl ,
                    controller: AthleteProfileAcademicsController
                }
            }
        });
    }
]);
