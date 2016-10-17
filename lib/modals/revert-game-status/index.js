const angular = window.angular;

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

/**
 * RevertGameStatus Modal
 * @module RevertGameStatus
 * @name RevertGameStatus.Modal
 * @type {service}
 */
RevertGameStatus.value('RevertGameStatus.ModalOptions', {
    templateUrl: 'lib/modals/revert-game-status/template.html',
    controller: RevertGameStatusController
});

RevertGameStatus.controller('RevertGameStatus.Controller', RevertGameStatusController);
RevertGameStatus.service('RevertGameStatus.Modal', RevertGameStatusModal);

export default RevertGameStatus;
