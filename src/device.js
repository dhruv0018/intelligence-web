var pkg = require('../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.run([
    'DEVICE', '$rootScope', '$window', 'DetectDeviceService',
    function run(DEVICE, $rootScope, $window, detectDevice) {

        $rootScope.DEVICE = DEVICE.DESKTOP;

        if (detectDevice.Android()) {
            $rootScope.DEVICE = DEVICE.MOBILE;
            DEVICE.MOBILE.ANDROID = true;
        } else if (detectDevice.iOS()) {
            $rootScope.DEVICE = DEVICE.MOBILE;
            DEVICE.MOBILE.IOS = true;
        }
    }
]);
