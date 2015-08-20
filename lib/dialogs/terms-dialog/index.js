/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template resources */
const template    = require('./template.html');
const templateUrl = 'terms-dialog/template.html';

/* Module Imports */
import TermsDialogController from './controller';
import TermsDialogService from './dialog';

/**
 * TermsDialog Module.
 * @module TermsDialog
 */
const TermsDialog = angular.module('TermsDialog', [
    'ngMaterial'
]);

/* Cache the template file */
TermsDialog.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

TermsDialog.controller('TermsDialog.Controller', TermsDialogController);
TermsDialog.service('TermsDialog.Service', TermsDialogService);

export default TermsDialog;
