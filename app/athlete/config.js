/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Athlete page module.
 * @module Athlete
 */
const Athlete = angular.module('Athlete');

/**
 * Athlete state router.
 * @module Athlete
 * @type {UI-Router}
 */
Athlete.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Athlete', {
            url: '/athlete',
            parent: 'base',
            abstract: true
        });
    }
]);
