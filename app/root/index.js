/* Component resources */
const RootTemplateUrl = 'app/root/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Root module
 * @module Root
 */
var Root = angular.module('root', []);


Root.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

            .state('root', {
                url: '',
                abstract: true,
                views: {
                    'root': {
                        templateUrl: RootTemplateUrl,
                        controller: 'RootController'
                    }
                }
            });
    }
]);

/**
 * Root controller.
 * @module Root
 * @name RootController
 * @type {Controller}
 */
Root.controller('RootController', [
    '$scope',
    function controller($scope) {
        // Watch for header display
        $scope.hideHeader = false;
        $scope.$on('toggleHeaderDisplay', function(toggleHeaderDisplayEvent, isSelfEditing) {
            $scope.hideHeader = isSelfEditing;
        });
        $scope.$on('$stateChangeStart', function(event) {
            $scope.hideHeader = false;
        });
    }
]);
