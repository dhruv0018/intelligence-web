/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import BreakdownPopupController from './controller';

/**
 * BreakdownPopup Module.
 * @module BreakdownPopup
 */
const BreakdownPopup = angular.module('BreakdownPopup', [
    'ui.router',
    'ui.bootstrap'
]);

/**
* BreakdownPopup Modal
* @module BreakdownPopup
* @name BreakdownPopup.Modal
* @type {service}
*/
BreakdownPopup.value('BreakdownPopup.ModalOptions', {
    templateUrl: 'lib/modals/breakdown-popup/template.html',
    controller: BreakdownPopupController,
    size: 'lg',
    backdropClass: 'breakdown-drop',
    windowClass: 'breakdown-dialog'
});

/**
 * BreakdownPopup Service
 * @module BreakdownPopup
 * @name BreakdownPopup.Service
 * @type {Service}
 */

BreakdownPopup.service('BreakdownPopup.Modal',[
    '$uibModal', 'BreakdownPopup.ModalOptions',
    function($uibModal, modalOptions) {

        const Modal = {

            open: function(playIds) {
                var resolves = {
                    resolve: {
                        playIds: function() { return playIds; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $uibModal.open(options);
            }
        };

        return Modal;
    }
]);

// BreakdownPopup.controller('BreakdownPopup.Controller', BreakdownPopupController);

export default BreakdownPopup;
