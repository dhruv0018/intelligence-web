/* Constants */
var TO = '';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * OpenModalText
 * @module OpenModalText
 */
var OpenModalText = angular.module('OpenModalText', []);

/**
 * OpenModalText directive.
 * @module OpenModalText
 * @name OpenModalText
 * @type {directive}
 */
OpenModalText.directive('openModalText', [
    'BasicModals',
    function directive(basicModals) {

        var OpenModal = {

            restrict: TO += ATTRIBUTES,

            scope: {
                openModalText: '@',
                modalButtonText: '@',
                modalCallback: '=',
                modalCancel: '='
            },

            link: link
        };

        function link($scope, element, attributes) {

            element.on('click', function() {

                var options = {
                    title: $scope.openModalText,
                    buttonText: $scope.modalButtonText
                };

                var callback = $scope.modalCallback || function() {};
                var cancelCallback = $scope.modalCancel || function() {};

                basicModals.openForText(options).result.then(callback, cancelCallback);

            });
        }

        return OpenModal;
    }
]);

export default OpenModalText;
