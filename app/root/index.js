/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Root module
 * @module Root
 */
var Root = angular.module('root', []);

/* Cache the template file */
Root.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('root.html', template);
    }
]);

Root.config([
    '$stateProvider',
    function config($stateProvider) {

        $stateProvider

            .state('root', {
                url: '',
                abstract: true,
                views: {
                    'root': {
                        templateUrl: 'root.html',
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
    '$scope', '$window', '$log',
    function controller($scope, $window, $log) {

        $scope.$watch('$window.trackJs', function() {
            if (!$log.decorated) {
                $log.initDecoration();
            }
        });
    }
]);



