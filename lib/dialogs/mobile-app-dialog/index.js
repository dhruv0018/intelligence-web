/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template resources */
const template    = require('./template.html');
const templateUrl = 'mobile-app-dialog/template.html';

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

/* Cache the template file */
MobileAppDialog.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

MobileAppDialog.controller('MobileAppDialog.Controller', MobileAppDialogController);
MobileAppDialog.service('MobileAppDialog.Service', MobileAppDialogService);

export default MobileAppDialog;
