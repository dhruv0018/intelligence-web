/* Fetch angular from the browser scope */
var angular = window.angular;

/* Module imports */
import controller from './controller';

const templateUrl = 'coach/analytics/team/template.html';
const template = require('./template.html');

/**
 * Analytics page module.
 * @module Analytics
 */
var TeamAnalytics = angular.module('Coach.Analytics.Team', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template files */
TeamAnalytics.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Team Analytics page state router.
 * @module Analytics
 * @type {UI-Router}
 */
TeamAnalytics.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Coach.Analytics.Team', {
            url: '/team',
            views: {
                'main@root': {
                    templateUrl,
                    controller
                }
            },
            resolve: {
                'Coach.Data': ['$q', 'Coach.Data.Dependencies', function($q, data) {
                    return $q.all(data);
                }]
            }
        });
    }
]);

TeamAnalytics.controller('Coach.Analytics.Team.Controller', controller);
