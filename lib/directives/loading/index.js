/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Loading
 * @module Loading
 */
var Loading = angular.module('loading', []);

/* Cache the template file */
Loading.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('loading.html', template);
    }
]);

/**
 * Loading directive.
 * @module Loading
 * @name Loading
 * @type {Directive}
 */
Loading.directive('loading', [
    '$rootScope', 'AnalyticsService',
    function directive($rootScope, analytics) {

        var Loading = {

            restrict: TO += ELEMENTS,

            templateUrl: 'loading.html',
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
                analytics.page();
            });

            /* Hide loading screen on state change error */
            $rootScope.$on('$stateChangeError', function() {

                $scope.showLoading = false;
            });
        }

        return Loading;
    }
]);
