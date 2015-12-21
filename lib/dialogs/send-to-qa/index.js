/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template resources */
import template from './template.html';
const templateUrl = 'send-to-qa-dialog/template.html';

/* Module Imports */
import SendToQaDialogController from './controller';
import SendToQaDialogService from './dialog';

/**
 * SendToQaDialog Module.
 * @module SendToQaDialog
 */
const SendToQaDialog = angular.module('SendToQaDialog', [
    'ngMaterial'
]);

/* Cache the template file */
SendToQaDialog.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

//SendToQaDialog.controller('SendToQaDialog.Controller', SendToQaDialogController);
SendToQaDialog.service('SendToQaDialog.Service', SendToQaDialogService);

export default SendToQaDialog;
