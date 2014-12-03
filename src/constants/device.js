var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var DEVICE = {

    MOBILE: {
        IOS: null,
        ANDROID: null
    },

    DESKTOP: {
        MAC: null,
        WINDOWS: null
    }
};

IntelligenceWebClient.constant('DEVICE', DEVICE);
