/* Fetch angular from the browser scope */
const angular = window.angular;

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


BreakdownDialog.controller('BreakdownDialog.Controller', BreakdownDialogController);
BreakdownDialog.service('BreakdownDialog.Service', BreakdownDialogService);

export default BreakdownDialog;
