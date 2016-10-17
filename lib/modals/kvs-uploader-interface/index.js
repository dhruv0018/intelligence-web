const angular = window.angular;

/**
 * kvsUploaderInterface page module.
 * @module kvsUploaderInterface
 */
const kvsUploaderInterface = angular.module('KvsUploaderInterface', [
    'ui.router',
    'ui.bootstrap'
]);

/**
 * kvsUploaderInterface modal dialog.
 * @module kvsUploaderInterface
 * @name kvsUploaderInterface.Modal
 * @type {value}
 */
kvsUploaderInterface.value('kvsUploaderInterface.ModalOptions', {

    templateUrl: 'lib/modals/kvs-uploader-interface/template.html',
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

        const Modal = {

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
    '$scope',
    '$state',
    '$modalInstance',
    'TeamsFactory',
    'PlayManager',
    'Film',
    'config',
    function controller(
        $scope,
        $state,
        $modalInstance,
        teams,
        playManager,
        film,
        config
    ) {
        $scope.modal = $modalInstance;
        $scope.film = film;
        $scope.config = config;
    }
]);

export default kvsUploaderInterface;
