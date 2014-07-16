/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * AdminManagement page module.
 * @module AdminManagement
 */
var AdminManagement = angular.module('AdminManagement', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
AdminManagement.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('admin-management.html', template);
    }
]);

/**
 * AdminManagement Modal
 * @module AdminManagement
 * @name AdminManagement.Modal
 * @type {service}
 */
AdminManagement.value('AdminManagement.ModalOptions', {

    templateUrl: 'admin-management.html',
    controller: 'AdminManagement.controller'
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
 * AdminManagement controller.
 * @module AdminManagement
 * @name AdminManagement.controller
 * @type {controller}
 */
AdminManagement.controller('AdminManagement.controller', [
    '$scope', '$state', '$modalInstance', 'Game',
    function controller($scope, $state, $modalInstance, game) {
        $scope.game = game;
    }
]);

