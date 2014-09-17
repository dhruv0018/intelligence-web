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
    'ShareFilm',
    'ExcelUpload',
    'BasicModals',
    'AthleteInfo',
    'ChangePassword',
    'AdminManagement'
]);

require('roles');
require('raw-film');
require('delete-game');
require('select-indexer');
require('film-breakdown');
require('share-film');
require('excel-upload');
require('basic-modals');
require('athlete-info');
require('change-password');
require('admin-management');
