/* Fetch angular from the browser scope */
const angular = window.angular;

/* Module Imports */
import SendToQaController from './controller';

/**
 * SendToQa Module.
 * @module SendToQa
 */
const SendToQa = angular.module('SendToQa', [
    'ui.router',
    'ui.bootstrap'
]);

/**
* SendToQa Modal
* @module SendToQa
* @name SendToQa.Modal
* @type {service}
*/
SendToQa.value('SendToQa.ModalOptions', {
    templateUrl: 'lib/modals/send-to-qa/template.html',
    controller: SendToQaController
});

/**
* SendToQa modal dialog.
* @module SendToQa
* @name SendToQa.Modal
* @type {service}
*/
SendToQa.service('SendToQa.Modal',[
    '$uibModal', 'SendToQa.ModalOptions',
    function($uibModal, modalOptions) {

        const Modal = {

            open: function(locals) {
                var resolves = {
                    resolve: {
                        flagsUrl: function() { return locals.flagsUrl; },
                        showFlags: function() { return locals.showFlags; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $uibModal.open(options);
            }
        };

        return Modal;
    }
]);

export default SendToQa;
