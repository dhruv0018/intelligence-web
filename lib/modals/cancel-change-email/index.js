const angular = window.angular;

/**
 * ChangeEmail page module.
 * @module ChangeEmail
 */
const CancelChangeEmail = angular.module('CancelChangeEmail', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * ChangeEmail Modal
 * @module CancelChangeEmail
 * @name CancelChangeEmail.Modal
 * @type {service}
 */
CancelChangeEmail.value('CancelChangeEmail.ModalOptions', {

    templateUrl: 'lib/modals/cancel-change-email/template.html',
    controller: 'CancelChangeEmail.controller'
});


/**
 * ChangeEmail modal dialog.
 * @module CancelChangeEmail
 * @name CancelChangeEmail.Modal
 * @type {service}
 */
CancelChangeEmail.service('CancelChangeEmail.Modal',[
    '$modal', 'CancelChangeEmail.ModalOptions',
    function($modal, modalOptions) {

        const Modal = {

            open: function(dataOptions) {

                var options = angular.extend(modalOptions, dataOptions);

                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * Change email controller.
 * @module CancelChangeEmail
 * @name CancelChangeEmail.controller
 * @type {controller}
 */
CancelChangeEmail.controller('CancelChangeEmail.controller', [
    '$scope', '$modalInstance', 'SessionService',
    function controller($scope, $modalInstance, session) {

    }
]);

export default CancelChangeEmail;
