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
    '$modal', 'AdminManagement.ModalOptions',
    function($modal, modalOptions) {

        const Modal = {

            open: function(game) {
                var resolves = {

                    resolve: {

                        Game: function() { return game; }
                    }
                };

                var options = angular.extend(modalOptions, resolves);

                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

AdminManagement.controller('AdminManagement.controller', AdminManagementController);

export default AdminManagement;
