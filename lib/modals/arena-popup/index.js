/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import ArenaPopupController from './controller';

/**
* ArenaPopup Module.
* @module ArenaPopup
*/

const ArenaPopup = angular.module('ArenaPopup', [
    'ui.router',
    'ui.bootstrap'
]);

/**
* ArenaPopup Modal
* @module ArenaPopup
* @name ArenaPopup.Modal
* @type {service}
*/
ArenaPopup.value('ArenaPopup.ModalOptions', {
    templateUrl: 'lib/modals/arena-popup/template.html',
    controller: ArenaPopupController
});

/**
* ArenaPopup modal dialog.
* @module ArenaPopup
* @name ArenaPopup.Modal
* @type {service}
*/
ArenaPopup.service('ArenaPopup.Modal',[
    '$modal', 'ArenaPopup.ModalOptions',
    function($modal, modalOptions) {

        const Modal = {

            open: function(field) {
                var resolves = {
                    resolve: {
                        field: function() { return field; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

ArenaPopup.controller('ArenaPopup.Controller', ArenaPopupController);

export default ArenaPopup;
