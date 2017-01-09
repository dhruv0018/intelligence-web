const angular = window.angular;

import AthleteInfoController from './controller';

/**
 * AthleteInfo page module.
 * @module AthleteInfo
 */
const AthleteInfo = angular.module('AthleteInfo', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * AthleteInfo Modal
 * @module AthleteInfo
 * @name AthleteInfo.Modal
 * @type {service}
 */
AthleteInfo.value('AthleteInfo.ModalOptions', {

    templateUrl: 'lib/modals/info/athlete-info/template.html',
    controller: AthleteInfoController
});


/**
 * AthleteInfo modal dialog.
 * @module AthleteInfo
 * @name AthleteInfo.Modal
 * @type {service}
 */
AthleteInfo.service('AthleteInfo.Modal',[
    '$uibModal', 'AthleteInfo.ModalOptions',
    function($uibModal, modalOptions) {

        const Modal = {

            open: function(dataOptions) {

                var resolves = {
                    resolve: {
                        Athlete: function() {
                            return dataOptions.targetAthlete;
                        }
                    }
                };

                var options = angular.extend(modalOptions, resolves, dataOptions);
                return $uibModal.open(options);
            }
        };

        return Modal;
    }
]);

AthleteInfo.controller('AthleteInfo.controller', AthleteInfoController);

export default AthleteInfo;
