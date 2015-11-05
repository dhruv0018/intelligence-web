/* Fetch angular from the browser scope */
const angular = window.angular;

/* Template resources */
import template from './template.html.js';
const templateUrl = 'revert-game-status/template.html';

/* Module Imports */
import RevertGameStatusController from './controller';
import RevertGameStatusModal from './modal';

/**
 * RevertGameStatus Module.
 * @module RevertGameStatus
 */
const RevertGameStatus = angular.module('RevertGameStatus', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
RevertGameStatus.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * RevertGameStatus Modal
 * @module RevertGameStatus
 * @name RevertGameStatus.Modal
 * @type {service}
 */
RevertGameStatus.value('RevertGameStatus.ModalOptions', {
    templateUrl: templateUrl,
    controller: RevertGameStatusController
});

RevertGameStatus.controller('RevertGameStatus.Controller', RevertGameStatusController);
RevertGameStatus.service('RevertGameStatus.Modal', RevertGameStatusModal);

export default RevertGameStatus;
