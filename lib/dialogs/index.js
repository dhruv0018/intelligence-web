/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Dialogs module.
 * @module Dialogs
 */
const Dialogs = angular.module('Dialogs', [
    'ArenaDialog'
]);

require('arena-dialog');