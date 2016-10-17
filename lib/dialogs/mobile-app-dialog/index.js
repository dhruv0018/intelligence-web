/* Fetch angular from the browser scope */
const angular = window.angular;


/* Module Imports */
import MobileAppDialogController from './controller';
import MobileAppDialogService from './dialog';

/**
 * MobileAppDialog Module.
 * @module MobileAppDialog
 */
const MobileAppDialog = angular.module('MobileAppDialog', [
    'ngMaterial'
]);

MobileAppDialog.controller('MobileAppDialog.Controller', MobileAppDialogController);
MobileAppDialog.service('MobileAppDialog.Service', MobileAppDialogService);

export default MobileAppDialog;
