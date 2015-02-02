/* Component dependencies */
require('film-home');
require('profile');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Athlete module.
 * @module Athlete
 */

var Athlete = angular.module('Athlete', [
    'Athlete.FilmHome',
    'Athlete.Profile'
]);

/**
 * Athlete state router.
 * @module Athlete
 * @type {UI-Router}
 */
Athlete.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var Athlete = {
            name: 'Athlete',
            url: '/athlete',
            parent: 'base',
            abstract: true
        };

        $stateProvider.state(Athlete);
    }
]);
