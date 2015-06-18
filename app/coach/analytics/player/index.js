/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Analytics page module.
 * @module Analytics
 */
var PlayerAnalytics = angular.module('Coach.Analytics.Player', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template files */
PlayerAnalytics.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/analytics/player/template.html', require('./template.html'));
    }
]);

/**
 * Player Analytics page state router.
 * @module Analytics
 * @type {UI-Router}
 */
PlayerAnalytics.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Coach.Analytics.Player', {
            url: '/player',
            views: {
                'main@root': {
                    templateUrl: 'coach/analytics/player/template.html',
                    controller: 'PlayerAnalyticsController'
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
