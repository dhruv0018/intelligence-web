/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import TermsPopupController from './controller';

/**
 * TermsPopup Module.
 * @module TermsPopup
 */
const TermsPopup = angular.module('TermsPopup', [
    'ui.router',
    'ui.bootstrap'
]);

/**
* TermsPopup Modal
* @module TermsPopup
* @name TermsPopup.Modal
* @type {service}
*/
TermsPopup.value('TermsPopup.ModalOptions', {
    templateUrl: 'lib/modals/terms-popup/template.html',
    controller: TermsPopupController,
    windowClass: 'new-terms'
});

/**
* TermsPopup modal dialog.
* @module TermsPopup
* @name TermsPopup.Modal
* @type {service}
*/
TermsPopup.service('TermsPopup.Modal',[
    '$modal', 'TermsPopup.ModalOptions',
    function($modal, modalOptions) {

        const Modal = {

            open: function() {
                return $modal.open(modalOptions);
            }
        };

        return Modal;
    }
]);

TermsPopup.controller('TermsPopup.Controller', TermsPopupController);

export default TermsPopup;
