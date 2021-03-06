var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.run([
    'VIEWPORTS', '$rootScope', '$window',
    function run(VIEWPORTS, $rootScope, $window) {

        $rootScope.viewport = $window.innerWidth < VIEWPORTS.MOBILE.width ? VIEWPORTS.MOBILE : VIEWPORTS.DESKTOP;

        angular.element($window).bind('resize',function() {

            var oldViewport = $rootScope.viewport;

            var resize = {

                width: $window.innerWidth
            };

            if (resize.width < VIEWPORTS.MOBILE.width) {

                $rootScope.viewport = VIEWPORTS.MOBILE;
            }

            else {

                $rootScope.viewport = VIEWPORTS.DESKTOP;
            }

            if (oldViewport !== $rootScope.viewport) {
                $rootScope.$apply();
            }

            $rootScope.$broadcast('resize', resize);
        });
    }
]);
