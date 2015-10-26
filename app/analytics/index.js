/* Component dependencies */
import PlayerAnalytics from './player/';
import TeamAlanytics from './team/';

/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Analytics page module.
 * @module Analytics
 */
const Analytics = angular.module('Analytics', [
    'ui.router',
    'ui.bootstrap',
    'PlayerAnalytics',
    'TeamAnalytics'
]);

/**
 * Analytics page state router.
 * @module Analytics
 * @type {UI-Router}
 */
Analytics.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('Analytics', {
                url: '/analytics',
                parent: 'base',
                abstract: true
            });
        }
    ]);

export default Analytics;
