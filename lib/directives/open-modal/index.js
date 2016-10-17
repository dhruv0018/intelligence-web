/* Constants */
var TO = '';
var ATTRIBUTES = 'A';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * OpenModal
 * @module OpenModal
 */
var OpenModal = angular.module('OpenModal', []);

/**
 * OpenModal directive.
 * @module OpenModal
 * @name OpenModal
 * @type {directive}
 */
OpenModal.directive('openModal', [
    '$injector',
    function directive($injector) {

        var OpenModal = {
            priority: 1,

            restrict: TO += ATTRIBUTES,

            scope: {
                openModal: '@',
                modalOptions: '='
            },

            link: link
        };

        function link($scope, element, attributes) {

            var modal = $injector.get($scope.openModal);

            element.on('click', function() {

                $scope.$apply(function() {

                    modal.open($scope.modalOptions);
                });
            });
        }

        return OpenModal;
    }
]);

export default OpenModal;
