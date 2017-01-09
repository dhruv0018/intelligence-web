const angular = window.angular;

import AdminManagementController from './controller';

/**
 * AdminManagement page module.
 * @module AdminManagement
 */
const AdminManagement = angular.module('AdminManagement', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * AdminManagement Modal
 * @module AdminManagement
 * @name AdminManagement.Modal
 * @type {service}
 */
AdminManagement.value('AdminManagement.ModalOptions', {

    templateUrl: 'lib/modals/admin-management/template.html',
    controller: AdminManagementController
});


/**
 * AdminManagement modal dialog.
 * @module AdminManagement
 * @name AdminManagement.Modal
 * @type {service}
 */
AdminManagement.service('AdminManagement.Modal',[
    '$uibModal', 'AdminManagement.ModalOptions',
    function($uibModal, modalOptions) {

        const Modal = {

            open: function(game) {
                var resolves = {

                    resolve: {

                        Game: function() { return game; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $uibModal.open(options);
            }
        };

        return Modal;
    }
]);

AdminManagement.controller('AdminManagement.controller', AdminManagementController);

export default AdminManagement;
