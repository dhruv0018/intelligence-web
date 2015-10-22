/* Fetch angular from the browser scope */
const angular = window.angular;
const PlayerAnalytics = angular.module('PlayerAnalytics', []);

/* Module imports */
import AnalyticsDataDependencies from '../data';
import PlayerAnalyticsController from './controller';
import template from './template.html';

PlayerAnalytics.factory('AnalyticsDataDependencies', AnalyticsDataDependencies);
PlayerAnalytics.controller('PlayerAnalyticsController', PlayerAnalyticsController);

/**
 * Player Analytics page state router.
 * @module Analytics
 * @type {UI-Router}
 */
PlayerAnalytics.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('PlayerAnalytics', {
            url: '/player',
            parent: 'Analytics',
            views: {
                'main@root': {
                    template,
                    controller: PlayerAnalyticsController
                }
            },
            resolve: {
                'Analytics.Player.Data': [
                    '$q', 'AnalyticsDataDependencies',
                    function($q, AnalyticsPlayerData) {
                        let data = new AnalyticsPlayerData();
                        return $q.all(data);
                    }
                ]
            }
        });
    }
]);

export default PlayerAnalytics;
