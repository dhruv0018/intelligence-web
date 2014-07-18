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
    'SelectIndexer',
    'FilmBreakdown',
    'DeadlineExpired',
    'ExcelUpload',
    'BasicModals',
    'AthleteInfo'
]);

require('roles');
require('raw-film');
require('delete-game');
require('select-indexer');
require('film-breakdown');
require('deadline-expired');
require('excel-upload');
require('basic-modals');
require('athlete-info');
