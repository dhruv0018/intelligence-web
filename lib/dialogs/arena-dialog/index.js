/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template resources */
const template = require('./template.html');
export const templateUrl = 'arena-dialog/template.html';

/* Module Imports */
import ArenaDialogController from './controller';
import ArenaDialogService from './dialog';

/**
 * ArenaDialog Module.
 * @module ArenaDialog
 */
export const ArenaDialog = angular.module('ArenaDialog', [
    'ngMaterial'
]);

/* Cache the template file */
ArenaDialog.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

ArenaDialog.controller('ArenaDialog.Controller', ArenaDialogController);
ArenaDialog.service('ArenaDialog.Service', ArenaDialogService);
