/* Constants */
var TO = '';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * OpenModalAlert
 * @module OpenModalAlert
 */
var OpenModalAlert = angular.module('OpenModalAlert', []);

/**
 * OpenModalAlert directive.
 * @module OpenModalAlert
 * @name OpenModalAlert
 * @type {directive}
 */
OpenModalAlert.directive('openModalAlert', [
    'BasicModals',
    function directive(basicModals) {

        var OpenModal = {

            restrict: TO += ATTRIBUTES,

            scope: {
                openModalAlert: '@',
                modalButtonText: '@',
                modalCallback: '='
            },

            link: link
        };

        function link($scope, element, attributes) {

            element.on('click', function() {

                var options = {
                    title: $scope.openModalAlert,
                    buttonText: $scope.modalButtonText
                };

                var callback = $scope.modalCallback || function() {};

                basicModals.openForAlert(options).result.then(function() {}, callback);

            });
        }

        return OpenModal;
    }
]);

export default OpenModalAlert;
