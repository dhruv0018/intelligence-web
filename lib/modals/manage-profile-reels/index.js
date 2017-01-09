const angular = window.angular;

import ManageProfileReelsController from './controller';

/**
 * ManageProfileReels page module.
 * @module ManageProfileReels
 */
const ManageProfileReels = angular.module('ManageProfileReels', [
    'ui.bootstrap'
]);

/**
 * ManageProfileReels Modal
 * @module ManageProfileReels
 * @name ManageProfileReels.Modal
 * @type {service}
 */
ManageProfileReels.value('ManageProfileReels.ModalOptions', {

    templateUrl: 'lib/modals/manage-profile-reels/template.html',
    controller: 'ManageProfileReels.controller',
    size: 'md'
});


/**
 * ManageProfileReels modal dialog.
 * @module ManageProfileReels
 * @name ManageProfileReels.Modal
 * @type {service}
 */
ManageProfileReels.service('ManageProfileReels.Modal',[
    '$uibModal', 'ManageProfileReels.ModalOptions',
    function($uibModal, modalOptions) {

        const Modal = {

            open: function(options) {

                options = options || {};
                angular.extend(modalOptions, options);

                return $uibModal.open(modalOptions);
            }
        };

        return Modal;
    }
]);

ManageProfileReels.controller('ManageProfileReels.controller', ManageProfileReelsController);

export default ManageProfileReels;
