/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template resources */
import template from './template.html.js';
const templateUrl = 'breakdown-dialog/template.html';

/* Module Imports */
import BreakdownDialogController from './controller';
import BreakdownDialogService from './dialog';

/**
 * BreakdownDialog Module.
 * @module BreakdownDialog
 */
const BreakdownDialog = angular.module('BreakdownDialog', [
    'ngMaterial'
]);

/* Cache the template file */
BreakdownDialog.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

BreakdownDialog.controller('BreakdownDialog.Controller', BreakdownDialogController);
BreakdownDialog.service('BreakdownDialog.Service', BreakdownDialogService);

export default BreakdownDialog;
