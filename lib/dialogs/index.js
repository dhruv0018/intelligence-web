/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Dialogs module.
 * @module Dialogs
 */
const Dialogs = angular.module('Dialogs', [
    'TermsDialog',
    'MobileAppDialog',
    'ArenaDialog'
]);

require('terms-dialog');
require('mobile-app-dialog');
require('arena-dialog');
