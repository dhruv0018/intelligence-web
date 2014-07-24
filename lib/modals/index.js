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
    'ExcelUpload',
    'BasicModals',
    'AthleteInfo',
    'AdminManagement'
]);

require('roles');
require('raw-film');
require('delete-game');
require('select-indexer');
require('film-breakdown');
require('excel-upload');
require('basic-modals');
require('athlete-info');
require('admin-management');
