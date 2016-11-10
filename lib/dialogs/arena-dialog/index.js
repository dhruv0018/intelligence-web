/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import ArenaDialogController from './controller';
import ArenaDialogService from './dialog';

/**
 * ArenaDialog Module.
 * @module ArenaDialog
 */
/**
 * FIXME:
 * Rename to ArenaFieldDialog
 * Naming causes confusion of responsibilities -
 * this dialog handles interactions and data related
 * to the arena field, more than what a dialog to display
 * an arena would do
 */
const ArenaDialog = angular.module('ArenaDialog', [
    'ngMaterial'
]);

ArenaDialog.controller('ArenaDialog.Controller', ArenaDialogController);
ArenaDialog.service('ArenaDialog.Service', ArenaDialogService);

export default ArenaDialog;
