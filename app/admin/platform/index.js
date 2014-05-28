require('leagues');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Platform module.
 * @module Platform
 */
var Platform = angular.module('platform', [
    'leagues'
]);

/**
 * Platform state router.
 * @module Platform
 * @type {UI-Router}
 */
Platform.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var platform = {
            name: 'platform',
            url: '/platform',
            parent: 'base',
            abstract: true
        };

        $stateProvider.state(platform);
    }
]);

