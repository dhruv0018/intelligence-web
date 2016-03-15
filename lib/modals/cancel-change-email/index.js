/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * ChangeEmail page module.
 * @module ChangeEmail
 */
var CancelChangeEmail = angular.module('CancelChangeEmail', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
CancelChangeEmail.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('cancel-change-email.html', template);
    }
]);

/**
 * ChangeEmail Modal
 * @module CancelChangeEmail
 * @name CancelChangeEmail.Modal
 * @type {service}
 */
CancelChangeEmail.value('CancelChangeEmail.ModalOptions', {

    templateUrl: 'cancel-change-email.html',
    controller: 'CancelChangeEmail.controller'
});


/**
 * ChangeEmail modal dialog.
 * @module CancelChangeEmail
 * @name CancelChangeEmail.Modal
 * @type {service}
 */
CancelChangeEmail.service('CancelChangeEmail.Modal',[
    '$modal', 'CancelChangeEmail.ModalOptions',
    function($modal, modalOptions) {

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
 * Change email controller.
 * @module CancelChangeEmail
 * @name CancelChangeEmail.controller
 * @type {controller}
 */
CancelChangeEmail.controller('CancelChangeEmail.controller', [
    '$scope', '$modalInstance', 'SessionService',
    function controller($scope, $modalInstance, session) {

    }
]);
