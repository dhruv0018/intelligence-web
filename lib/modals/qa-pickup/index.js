const angular = window.angular;

import QaPickupController from './controller';

/**
 * QaPickup page module.
 * @module QaPickup
 */
const QaPickup = angular.module('QaPickup', [
    'ui.router',
    'ui.bootstrap',
    'ngMaterial'
]);

/**
 * QaPickup Modal
 * @module QaPickup
 * @name QaPickup.Modal
 * @type {service}
 */
QaPickup.value('QaPickup.ModalOptions', {

    templateUrl: 'lib/modals/qa-pickup/template.html',
    controller: QaPickupController,
    size: 'm'
});


/**
 * QaPickup modal dialog.
 * @module QaPickup
 * @name QaPickup.Modal
 * @type {service}
 */

QaPickup.service('QaPickup.Modal',[
    '$modal', 'QaPickup.ModalOptions',
    function($modal, modalOptions) {

        const Modal = {

            open: function(options) {

                options = options || {};
                angular.extend(modalOptions, options);

                return $modal.open(modalOptions);
            }
        };

        return Modal;
    }
]);

QaPickup.controller('QaPickup.controller', QaPickupController);

export default QaPickup;
