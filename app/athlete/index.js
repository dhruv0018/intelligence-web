/* Component dependencies */
require('film-home');
require('profile');
require('edit-profile');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Athlete module.
 * @module Athlete
 */

var Athlete = angular.module('Athlete', [
    'Athlete.FilmHome',
    'Athlete.Profile',
    'Athlete.EditProfile'
]);

/* File dependencies */
require('./config');
