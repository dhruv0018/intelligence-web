/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Profile.Stats page module.
 * @module Profile.Stats
 */
var Stats = angular.module('Athlete.Profile.Stats');

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
                    templateUrl: 'athlete/profile/stats/template.html',
                    controller: 'Athlete.Profile.Stats.controller'
                }
            }
        });
    }
]);
