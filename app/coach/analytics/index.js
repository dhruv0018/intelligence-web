/* Fetch angular from the browser scope */
var angular = window.angular;

require('player');
require('team');

/**
 * Analytics page module.
 * @module Analytics
 */
var Analytics = angular.module('Coach.Analytics', [
    'ui.router',
    'ui.bootstrap',
    'Coach.Analytics.Team',
    'Coach.Analytics.Player'
]);

/* Cache the template files */
Analytics.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/analytics/template.html', require('./template.html'));
    }
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

            .state('Coach.Analytics', {
                url: '/analytics',
                views: {
                    'main@root': {
                        templateUrl: 'coach/analytics/template.html',
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
