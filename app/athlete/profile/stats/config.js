/* Fetch angular from the browser scope */
const angular = window.angular;

const templateUrl = 'athlete/profile/stats/template.html';

/**
 * Profile.Stats page module.
 * @module Profile.Stats
 */
const Stats = angular.module('Athlete.Profile.Stats');

/**
 * Profile.Stats page state router.
 * @module Profile.Stats
 * @type {UI-Router}
 */
Stats.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

        .state('Athlete.Profile.Stats', {
            views: {
                'stats@Athlete.Profile': {
                    templateUrl: templateUrl,
                    controller: 'Athlete.Profile.Stats.controller'
                }
            }
        });
    }
]);
