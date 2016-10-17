/* Constants */
var TO = '';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * OpenModalConfirm
 * @module OpenModalConfirm
 */
var OpenModalConfirm = angular.module('OpenModalConfirm', []);

/**
 * OpenModalConfirm directive.
 * @module OpenModalConfirm
 * @name OpenModalConfirm
 * @type {directive}
 */
OpenModalConfirm.directive('openModalConfirm', [
    'BasicModals',
    function directive(basicModals) {

        var OpenModal = {

            restrict: TO += ATTRIBUTES,

            scope: {
                openModalConfirm: '@',
                modalConfirmButtonText: '@',
                modalCancelButtonText: '@',
                modalConfirm: '=',
                modalCancel: '='
            },

            link: link
        };

        function link($scope, element, attributes) {

            element.on('click', function() {

                var options = {
                    title: $scope.openModalConfirm,
                    buttonText: $scope.modalConfirmButtonText,
                    cancelButtonText: $scope.modalCancelButtonText
                };

                var confirmCallback = $scope.modalConfirm || function() {};
                var cancelCallback = $scope.modalCancel || function() {};

                basicModals.openForConfirm(options).result.then(confirmCallback, cancelCallback);

            });
        }

        return OpenModal;
    }
]);

export default OpenModalConfirm;
