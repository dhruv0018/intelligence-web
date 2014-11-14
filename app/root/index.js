/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Root module
 * @module Root
 */
var Root = angular.module('root', []);

Root.run([
    'VIEWPORTS', '$rootScope', '$window',
    function run(VIEWPORTS, $rootScope, $window) {

        angular.element($window).bind('resize',function() {

            var resize = {

                width: $window.outerWidth
            };

            if (resize.width < VIEWPORTS.MOBILE.width) {

                $rootScope.viewport = VIEWPORTS.MOBILE;
            }

            else {

                $rootScope.viewport = VIEWPORTS.DESKTOP;
            }

            $rootScope.$broadcast('resize', resize);
        });
    }
]);

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
    '$scope',
    function controller($scope) {

    }
]);



