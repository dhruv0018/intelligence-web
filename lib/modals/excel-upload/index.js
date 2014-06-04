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
    '$modal', 'ExcelUpload.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

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

/**
 * ExcelUpload controller.
 * @module ExcelUpload
 * @name ExcelUpload.controller
 * @type {controller}
 */
ExcelUpload.controller('ExcelUpload.controller', [
    '$scope', '$state', '$modalInstance', 'GamesFactory', 'Game', 'AlertsService',
    function controller($scope, $state, $modalInstance, games, game, alerts) {
        console.log('working');
    }
]);

