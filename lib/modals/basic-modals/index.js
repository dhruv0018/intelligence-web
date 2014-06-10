var templateText = require('./template-text.html');
var templateConfirm = require('./template-confirm.html');
var templateAlert = require('./template-alert.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

var BasicModals = angular.module('BasicModals', []);

var templateTextUrl = 'text.html';
var templateConfirmUrl = 'confirm.html';
var templateAlertUrl = 'alert.html';

BasicModals.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateTextUrl, templateText);
        $templateCache.put(templateConfirmUrl, templateConfirm);
        $templateCache.put(templateAlertUrl, templateAlert);
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
        return {
            openForText: function(options) {
                options = options || {};

                options.title = options.title || '';
                options.buttonText = options.buttonText || 'OK';

                return $modal.open({
                    templateUrl: 'text.html',
                    size: 'sm',
                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {

                        $scope.title = options.title;
                        $scope.buttonText = options.buttonText;

                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                        };

                        $scope.ok = function(text) {
                            $modalInstance.close(text);
                        };
                    }]
                });
            },
            openForConfirm: function(options) {
                options = options || {};

                options.title = options.title || '';
                options.buttonText = options.buttonText || 'OK';
                options.cancelButtonText = options.cancelButtonText || 'Cancel';

                return $modal.open({
                    size: 'sm',
                    templateUrl: 'confirm.html',
                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {

                        $scope.title = options.title;
                        $scope.buttonText = options.buttonText;
                        $scope.cancelButtonText = options.cancelButtonText;

                        $scope.ok = function() {
                            $modalInstance.close(true);
                        };

                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                        };
                    }]
                });
            },
            openForAlert: function(options) {
                options = options || {};

                options.title = options.title || '';
                options.buttonText = options.buttonText || 'OK';

                return $modal.open({
                    size: 'sm',
                    templateUrl: 'alert.html',
                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {

                        $scope.title = options.title;
                        $scope.buttonText = options.buttonText;

                        $scope.ok = function() {
                            $modalInstance.dismiss();
                        };
                    }]
                });
            }
        };
    }
]);



