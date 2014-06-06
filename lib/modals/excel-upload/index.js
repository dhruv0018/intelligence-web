/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * ExcelUpload page module.
 * @module ExcelUpload
 */
var ExcelUpload = angular.module('ExcelUpload', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
ExcelUpload.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('excel-upload.html', template);
    }
]);

/**
 * ExcelUpload Modal
 * @module ExcelUpload
 * @name ExcelUpload.Modal
 * @type {service}
 */
ExcelUpload.value('ExcelUpload.ModalOptions', {

    templateUrl: 'excel-upload.html',
    controller: 'ExcelUpload.controller'
});


/**
 * ExcelUpload modal dialog.
 * @module ExcelUpload
 * @name ExcelUpload.Modal
 * @type {service}
 */
ExcelUpload.service('ExcelUpload.Modal',[
    '$q', '$modal', 'ExcelUpload.ModalOptions',
    function($q, $modal, modalOptions) {

        var Modal = {

            open: function(dataOptions) {
                var options = angular.extend(modalOptions, dataOptions);
                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * ExcelUpload controller.
 * @module ExcelUpload
 * @name ExcelUpload.controller
 * @type {controller}
 */
ExcelUpload.controller('ExcelUpload.controller', [
    '$scope',
    function controller($scope) {
        console.log($scope);
    }
]);

