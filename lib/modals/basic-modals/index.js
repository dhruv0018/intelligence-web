var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

var BasicModals = angular.module('BasicModals', []);

var templateUrl = 'modalTemplate.html';

BasicModals.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

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

        var openModalType = function(type, options) {

            options = options || {};

            options.title = options.title || '';
            options.bodyText = options.bodyText || '';
            options.buttonText = options.buttonText || 'OK';
            options.cancelButtonText = options.cancelButtonText || 'Cancel';

            return $modal.open({
                size: 'md',
                templateUrl: templateUrl,
                controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {

                    $scope.type = type;
                    $scope.title = options.title;
                    $scope.bodyText = options.bodyText;
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
