/* Component resources */
var template = require('./stylesheet.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Stylesheet
 * @module Stylesheet
 */
var Stylesheet = angular.module('stylesheet', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
Stylesheet.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('stylesheet.html', template);
    }
]);

/**
 * Stylesheet state router.
 * @module Stylesheet
 * @type {UI-Router}
 */
Stylesheet.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('stylesheet', {
                url: '/stylesheet',
                views: {
                    'root': {
                        templateUrl: 'stylesheet.html'
                    }
                }
            });
    }
]);
