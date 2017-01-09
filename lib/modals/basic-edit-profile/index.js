const angular = window.angular;

import BasicEditProfileController from './controller';

/**
 * BasicEditProfile page module.
 * @module BasicEditProfile
 */
const BasicEditProfile = angular.module('BasicEditProfile', [
    'ui.bootstrap'
]);

/**
 * BasicEditProfile Modal
 * @module BasicEditProfile
 * @name BasicEditProfile.Modal
 * @type {service}
 */
BasicEditProfile.value('BasicEditProfile.ModalOptions', {

    templateUrl: 'lib/modals/basic-edit-profile/template.html',
    controller: BasicEditProfileController,
    size: 'md'
});


/**
 * BasicEditProfile modal dialog.
 * @module BasicEditProfile
 * @name BasicEditProfile.Modal
 * @type {service}
 */
BasicEditProfile.service('BasicEditProfile.Modal',[
    '$uibModal', 'BasicEditProfile.ModalOptions',
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

BasicEditProfile.controller('BasicEditProfile.controller', BasicEditProfileController);

export default BasicEditProfile;
