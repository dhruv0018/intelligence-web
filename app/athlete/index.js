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

/* File dependencies */
require('./config');
