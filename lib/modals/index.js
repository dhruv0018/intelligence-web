/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Modals module.
 * @module Modals
 */
var Modals = angular.module('Modals', [
    'roles',
    'RawFilm.Modal'
]);

require('roles');
require('raw-film');

