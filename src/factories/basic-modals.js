var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);


/*
 {
    title: 'Title of modal',
    buttonText: 'text for submit button'
 }
 */

IntelligenceWebClient.factory('BasicModals', [
    '$modal',
    function($modal) {
        return {
            openForText: function(options) {
                options = options || {};

                options.title = options.title || '';
                options.buttonText = options.buttonText || 'OK';

                return $modal.open({
                    size: 'sm',
                    template: '<h2>' + options.title + '</h2><textarea ng-model="textValue"></textarea><button data-ng-click="ok(textValue)">' + options.buttonText + '</button>',
                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {

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

                return $modal.open({
                    size: 'sm',
                    template: '<h2>' + options.title + '</h2><button data-ng-click="ok()">' + options.buttonText + '</button>',
                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {

                        $scope.ok = function() {
                            $modalInstance.close(true);
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
                    template: '<h2>' + options.title + '</h2><button data-ng-click="ok()">' + options.buttonText + '</button>',
                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {

                        $scope.ok = function() {
                            $modalInstance.dismiss();
                        };
                    }]
                });
            }
        };
    }
]);



