/* Fetch angular from the browser scope */
const angular = window.angular;
const TeamAnalytics = angular.module('TeamAnalytics', []);

/* Module imports */
import AnalyticsDataDependencies from '../data';
import TeamAnalyticsController from './controller';

TeamAnalytics.factory('AnalyticsDataDependencies', AnalyticsDataDependencies);
TeamAnalytics.controller('TeamAnalyticsController', TeamAnalyticsController);

/**
 * Team Analytics page state router.
 * @module Analytics
 * @type {UI-Router}
 */
TeamAnalytics.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('TeamAnalytics', {
            url: '/team',
            parent: 'Analytics',
            views: {
                'main@root': {
                    templateUrl: 'app/analytics/team/template.html',
                    controller: TeamAnalyticsController
                }
            },
            resolve: {
                'Analytics.Team.Data': [
                    '$q', 'AnalyticsDataDependencies',
                    function($q, AnalyticsTeamData) {
                        let data = new AnalyticsTeamData();
                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

export default TeamAnalytics;
