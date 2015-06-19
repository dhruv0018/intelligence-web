/* Fetch angular from the browser scope */
var angular = window.angular;

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

        $templateCache.put('coach/analytics/team/template.html', require('./template.html'));
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
                    templateUrl: 'coach/analytics/team/template.html',
                    controller: 'TeamAnalyticsController'
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

require('./controller');
