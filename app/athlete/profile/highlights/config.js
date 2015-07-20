/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/profile/highlights/template.html';

/**
 * Profile.Highlights page module.
 * @module Profile.Highlights
 */
const Highlights = angular.module('Athlete.Profile.Highlights');

/**
 * Profile.Highlights page state router.
 * @module Profile.Highlights
 * @type {UI-Router}
 */
Highlights.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.Highlights', {
            views: {
                'highlights@Athlete.Profile': {
                    templateUrl: templateUrl,
                    controller: 'Athlete.Profile.Highlights.controller'
                }
            }
        });
    }
]);
