const angular = window.angular;
const moment = require('moment');

import ProfileOnboardingController from './controller';

/**
 * ProfileOnboarding page module.
 * @module ProfileOnboarding
 */
const ProfileOnboarding = angular.module('ProfileOnboarding', [
    'ui.bootstrap'
]);

/**
 * ProfileOnboarding Modal
 * @module ProfileOnboarding
 * @name ProfileOnboarding.Modal
 * @type {service}
 */
ProfileOnboarding.value('ProfileOnboarding.ModalOptions', {

    templateUrl: 'lib/modals/profile-onboarding/template.html',
    controller: 'ProfileOnboarding.controller',
    size: 'md'
});


/**
 * ProfileOnboarding modal dialog.
 * @module ProfileOnboarding
 * @name ProfileOnboarding.Modal
 * @type {service}
 */
ProfileOnboarding.service('ProfileOnboarding.Modal',[
    '$modal', 'ProfileOnboarding.ModalOptions',
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

ProfileOnboarding.controller('ProfileOnboarding.controller', ProfileOnboardingController);

export default ProfileOnboarding;
