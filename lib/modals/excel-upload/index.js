const angular = window.angular;

import ExcelUploadController from './controller';

/**
 * ExcelUpload page module.
 * @module ExcelUpload
 */
const ExcelUpload = angular.module('ExcelUpload', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * ExcelUpload Modal
 * @module ExcelUpload
 * @name ExcelUpload.Modal
 * @type {service}
 */
ExcelUpload.value('ExcelUpload.ModalOptions', {

    templateUrl: 'lib/modals/excel-upload/template.html',
    controller: ExcelUploadController
});

/**
 * ExcelUpload modal dialog.
 * @module ExcelUpload
 * @name ExcelUpload.Modal
 * @type {service}
 */
ExcelUpload.service('ExcelUpload.Modal',[
    '$q', '$uibModal', 'ExcelUpload.ModalOptions',
    function($q, $uibModal, modalOptions) {

        var Modal = {

            open: function(dataOptions) {
                var options = angular.extend(modalOptions, dataOptions);
                return $uibModal.open(options);
            }
        };

        return Modal;
    }
]);

ExcelUpload.controller('ExcelUpload.controller', ExcelUploadController);

export default ExcelUpload;
