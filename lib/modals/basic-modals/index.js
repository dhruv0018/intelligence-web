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
    '$modal',
    function($modal) {

        const openModalType = function(type, options) {

            options = options || {};

            options.title = options.title || '';
            options.bodyHeader = options.bodyHeader || '';
            options.bodyText = options.bodyText || '';
            options.bodySubtext = options.bodySubtext || '';
            options.buttonText = options.buttonText || 'OK';
            options.cancelButtonText = options.cancelButtonText || 'Cancel';

            return $modal.open({
                size: 'md',
                templateUrl: 'lib/modals/basic-modals/template.html',
                controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {

                    $scope.type = type;
                    $scope.title = options.title;
                    $scope.bodyHeader = options.bodyHeader;
                    $scope.bodyText = options.bodyText;
                    $scope.bodySubtext = options.bodySubtext;
                    $scope.buttonText = options.buttonText;
                    $scope.cancelButtonText = options.cancelButtonText;

                    $scope.ok = function(val) {
                        $modalInstance.close(val);
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
