/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module imports */
import controller from './controller';

const templateUrl = 'coach/analytics/player/template.html';
const template = require('./template');

/**
 * Analytics page module.
 * @module Analytics
 */
const PlayerAnalytics = angular.module('Coach.Analytics.Player', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template files */
PlayerAnalytics.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
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

PlayerAnalytics.controller('Coach.Analytics.Player.Controller', controller);
