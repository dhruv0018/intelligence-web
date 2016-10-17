/* Fetch angular from the browser scope */
const angular = window.angular;


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


TermsDialog.controller('TermsDialog.Controller', TermsDialogController);
TermsDialog.service('TermsDialog.Service', TermsDialogService);

export default TermsDialog;
