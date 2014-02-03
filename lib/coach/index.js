/* Component dependencies */
require('add-film');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Coach module.
 * @module Coach
 */
var Coach = angular.module('coach', [
    'add-film'
]);

/**
 * Coach state router.
 * @module Coach
 * @type {UI-Router}
 */
Coach.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var coach = {
            name: 'coach',
            url: '/coach',
            parent: 'base',
            abstract: true
        };

        $stateProvider.state(coach);
    }
]);
