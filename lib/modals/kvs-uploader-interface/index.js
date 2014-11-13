/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * kvsUploaderInterface page module.
 * @module kvsUploaderInterface
 */
var kvsUploaderInterface = angular.module('KvsUploaderInterface', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
kvsUploaderInterface.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('kvs-uploader-interface.html', template);
    }
]);

/**
 * kvsUploaderInterface modal dialog.
 * @module kvsUploaderInterface
 * @name kvsUploaderInterface.Modal
 * @type {value}
 */
kvsUploaderInterface.value('kvsUploaderInterface.ModalOptions', {

    templateUrl: 'kvs-uploader-interface.html',
    controller: 'kvsUploaderInterface.controller'
});

/**
 * kvsUploaderInterface modal dialog.
 * @module kvsUploaderInterface
 * @name kvsUploaderInterface.Modal
 * @type {value}
 */
kvsUploaderInterface.service('kvsUploaderInterface.Modal', [
    '$modal', 'kvsUploaderInterface.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(options) {

                options = options || {};
                var resolves = {
                    resolve: {
                        Film: function() {
                            return options.film;
                        }
                    }
                };

                options = angular.extend(modalOptions, resolves, options);
                return $modal.open(options);
            }
        };

        return Modal;
    }
]);

/**
 * kvsUploaderInterface controller.
 * @module kvsUploaderInterface
 * @name kvsUploaderInterface.controller
 * @type {controller}
 */
kvsUploaderInterface.controller('kvsUploaderInterface.controller', [
    '$scope', '$state', '$modalInstance', 'TeamsFactory', 'PlayManager', 'Film',
    function controller($scope, $state, $modalInstance, teams, playManager, film) {
        $scope.modal = $modalInstance;
        $scope.film = film;
    }
]);

