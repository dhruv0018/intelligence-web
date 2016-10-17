const angular = window.angular;

import AddProfileTeamController from './controller';

/**
 * AddProfileTeam page module.
 * @module AddProfileTeam
 */
const AddProfileTeam = angular.module('AddProfileTeam', [
    'ui.bootstrap'
]);

/**
 * AddProfileTeam Modal
 * @module AddProfileTeam
 * @name AddProfileTeam.Modal
 * @type {service}
 */
AddProfileTeam.value('AddProfileTeam.ModalOptions', {

    templateUrl: 'lib/modals/add-profile-team/template.html',
    controller: AddProfileTeamController,
    size: 'md'
});


/**
 * AddProfileTeam modal dialog.
 * @module AddProfileTeam
 * @name AddProfileTeam.Modal
 * @type {service}
 */
AddProfileTeam.service('AddProfileTeam.Modal',[
    '$modal', 'AddProfileTeam.ModalOptions',
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

AddProfileTeam.controller('AddProfileTeam.controller', AddProfileTeamController);

export default AddProfileTeam;
