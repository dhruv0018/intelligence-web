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
    'ExcelUpload',
    'BasicModals',
    'AthleteInfo'
]);

require('roles');
require('raw-film');
require('delete-game');
require('excel-upload');
require('basic-modals');
require('athlete-info');

