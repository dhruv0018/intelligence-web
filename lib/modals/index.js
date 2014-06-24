/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Modals module.
 * @module Modals
 */
var Modals = angular.module('Modals', [
    'Roles',
    'RawFilm',
    'DeleteGame',
    'FilmBreakdown',
    'ExcelUpload',
    'BasicModals',
    'AthleteInfo'
]);

require('roles');
require('raw-film');
require('delete-game');
require('film-breakdown');
require('excel-upload');
require('basic-modals');
require('athlete-info');
