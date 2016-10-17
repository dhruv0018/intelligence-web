/* Fetch angular from the browser scope */
var angular = window.angular;
import AthleteFilmHome from './film-home/index.js';
import AthleteProfile from './profile/index.js';
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

        $stateProvider

        .state('Athlete', {
            url: '/athlete',
            parent: 'base',
            abstract: true
        });
    }
]);
