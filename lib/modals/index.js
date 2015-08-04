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
    'AddReel',
    'SelectIndexer',
    'FilmBreakdown',
    'ShareFilm',
    'ExcelUpload',
    'BasicModals',
    'Info',
    'ChangePassword',
    'AdminManagement',
    'KvsUploaderInterface',
    'AdminManagement',
    'ManageProfileReels',
    'AddProfileTeam'
]);

require('roles');
require('raw-film');
require('delete-game');
require('add-reel');
require('select-indexer');
require('film-breakdown');
require('share-film');
require('excel-upload');
require('basic-modals');
require('change-password');
require('admin-management');
require('kvs-uploader-interface');
require('info');
require('manage-profile-reels');
require('add-profile-team');
