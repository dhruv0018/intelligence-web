/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Modals module.
 * @module Modals
 */
var Modals = angular.module('Modals', [
    'RawFilm',
    'DeleteGame',
    'AddReel',
    'SelectIndexer',
    'ShareFilm',
    'ExcelUpload',
    'BasicModals',
    'Info',
    'ChangePassword',
    'AdminManagement',
    'KvsUploaderInterface',
    'AdminManagement',
    'CopyGame',
    'QaPickup',
    'ManageProfileReels',
    'AddProfileTeam',
    'ProfileOnboarding',
    'BasicEditProfile',
    'RevertGameStatus',
    'CopyRawFilm'
]);

require('raw-film');
require('delete-game');
require('add-reel');
require('select-indexer');
require('share-film');
require('excel-upload');
require('basic-modals');
require('change-password');
require('admin-management');
require('kvs-uploader-interface');
require('info');
require('game-copy');
require('qa-pickup');
require('manage-profile-reels');
require('add-profile-team');
require('profile-onboarding');
require('basic-edit-profile');
require('game-copy-raw-film');
