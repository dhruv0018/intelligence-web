/* Fetch angular from the browser scope */
const angular = window.angular;
const ProfileStatsTemplateUrl = 'app/athlete/profile/stats/template.html';

import AthleteProfileStatsController from './controller';

/**
 * Stats page module.
 * @module Stats
 */
const Stats = angular.module('Athlete.Profile.Stats', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial',
    'no-results'
]);

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
                    templateUrl: ProfileStatsTemplateUrl,
                    controller: AthleteProfileStatsController
                }
            }
        });
    }
]);
