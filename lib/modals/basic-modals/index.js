const angular = window.angular;

const BasicModals = angular.module('BasicModals', []);

/*
 {
    title: 'Title of modal',
    buttonText: 'text for submit button',
    cancelButtonText: (optional for confirm)
 }
 */

BasicModals.factory('BasicModals', [
    '$uibModal',
    function($uibModal) {

        const openModalType = function(type, options) {

            options = options || {};

            options.title = options.title || '';
            options.bodyHeader = options.bodyHeader || '';
            options.bodyText = options.bodyText || '';
            options.bodySubtext = options.bodySubtext || '';
            options.buttonText = options.buttonText || 'OK';
            options.cancelButtonText = options.cancelButtonText || 'Cancel';

            return $uibModal.open({
                size: 'md',
                templateUrl: 'lib/modals/basic-modals/template.html',
                controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

                    $scope.type = type;
                    $scope.title = options.title;
                    $scope.bodyHeader = options.bodyHeader;
                    $scope.bodyText = options.bodyText;
                    $scope.bodySubtext = options.bodySubtext;
                    $scope.buttonText = options.buttonText;
                    $scope.cancelButtonText = options.cancelButtonText;

                    $scope.ok = function(val) {
                        $uibModalInstance.close(val);
                    };
                }]
            });
        };

        return {
            openForText: function(options) {
                return openModalType('text', options);
            },
            openForConfirm: function(options) {
                return openModalType('confirm', options);
            },
            openForAlert: function(options) {
                return openModalType('alert', options);
            }
        };
    }
]);

export default BasicModals;
