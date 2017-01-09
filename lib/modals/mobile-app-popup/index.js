/* Fetch angular from the browser scope */
const angular = window.angular;


/* Module Imports */
import MobileAppPopupController from './controller';

/**
 * MobileAppPopup Module.
 * @module MobileAppPopup
 */
const MobileAppPopup = angular.module('MobileAppPopup', [
    'ui.router',
    'ui.bootstrap'
]);

/**
* MobileAppPopup Modal
* @module MobileAppPopup
* @name MobileAppPopup.Modal
* @type {service}
*/
MobileAppPopup.value('MobileAppPopup.ModalOptions', {
    templateUrl: 'lib/modals/mobile-app-popup/template.html',
    controller: MobileAppPopupController,
    windowClass: 'mobile-app-modal'
});

/**
* MobileAppPopup modal dialog.
* @module MobileAppPopup
* @name MobileAppPopup.Modal
* @type {service}
*/
MobileAppPopup.service('MobileAppPopup.Modal',[
    '$uibModal', 'MobileAppPopup.ModalOptions', 'MOBILE_APP_PROMPT_SHOWN',
    function($uibModal, modalOptions, MOBILE_APP_PROMPT_SHOWN) {

        const Modal = {

            open: function() {
                let modalShownThisSession = sessionStorage.getItem(MOBILE_APP_PROMPT_SHOWN);

                if (!modalShownThisSession) {

                    try {

                        sessionStorage.setItem(MOBILE_APP_PROMPT_SHOWN, true);
                    } catch (e) {

                        console.warn('Cannot use sessionStorage. Error:', e);
                        // TODO: Fallback to some sort of cookie implementation
                    }

                    return $uibModal.open(modalOptions);
                }
            }
        };

        return Modal;
    }
]);

MobileAppPopup.controller('MobileAppPopup.Controller', MobileAppPopupController);

export default MobileAppPopup;
