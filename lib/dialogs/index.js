/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Dialogs module.
 * @module Dialogs
 */
const Dialogs = angular.module('Dialogs', [
    'TermsDialog',
    'ArenaDialog'
]);

require('terms-dialog');
require('arena-dialog');
