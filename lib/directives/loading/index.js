/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Loading
 * @module Loading
 */
var Loading = angular.module('loading', []);

/**
 * Loading directive.
 * @module Loading
 * @name Loading
 * @type {Directive}
 */
Loading.directive('loading', [
    '$rootScope',
    function directive($rootScope) {

        var Loading = {

            restrict: TO += ELEMENTS,

            templateUrl: 'lib/directives/loading/template.html',
            link: link
        };

        function link($scope, element, attributes, controller) {

            $scope.showLoading = false;

            /* Show loading screen on start of state change */
            $rootScope.$on('$stateChangeStart', function() {

                $scope.showLoading = true;
            });

            /* Hide loading screen on state change success */
            $rootScope.$on('$stateChangeSuccess', function() {

                $scope.showLoading = false;
            });

            /* Hide loading screen on state change error */
            $rootScope.$on('$stateChangeError', function() {

                $scope.showLoading = false;
            });

            /* Hide loading screen on state change end */
            $rootScope.$on('$stateChangeEnded', function() {

                $scope.showLoading = false;
            });
        }

        return Loading;
    }
]);

export default Loading;
