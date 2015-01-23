/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

/**
 * Arena page module.
 * @module Arena
 */
var ArenaModal = angular.module('ArenaModal', [
    'ui.router',
    'ui.bootstrap'
]);

/* Cache the template file */
ArenaModal.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('arena-modal.html', template);
    }
]);

/**
 * Arena modal dialog.
 * @module Arena
 * @name ArenaModal.Modal
 * @type {value}
 */
ArenaModal.value('ArenaModal.ModalOptions', {

    templateUrl: 'arena-modal.html',
    controller: 'ArenaModal.controller',
    size: 'md'
});

/**
 * Arena modal dialog.
 * @module Arena
 * @name ArenaModal.Modal
 * @type {value}
 */
ArenaModal.service('ArenaModal.Modal', [
    '$modal', 'ArenaModal.ModalOptions',
    function($modal, modalOptions) {

        var Modal = {

            open: function(options) {

                options = options || {};
                options.windowClass = 'arena-modal-size';
                angular.extend(modalOptions, options);
                return $modal.open(modalOptions);
            }
        };

        return Modal;
    }
]);

/**
 * Arena controller.
 * @module Arena
 * @name ArenaModal.controller
 * @type {controller}
 */
ArenaModal.controller('ArenaModal.controller', [
    '$scope', '$state', '$modalInstance',

    function controller($scope, $state, $modalInstance) {

        $scope.variable.value = {};

        $scope.coordinates = {};
        $scope.$watch('coordinates', function(coordinates) {
            $scope.variable.value.coordinates = coordinates;
        });

        $scope.region = {};
        $scope.$watch('region.id', function(regionId) {
            $scope.variable.value.region = regionId;
        });
    }
]);

