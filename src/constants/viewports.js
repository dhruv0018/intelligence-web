var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var VIEWPORTS = {

    MOBILE: {
        id: 1,
        name: 'Mobile',
        width: require('./breakpoints').MOBILE
    },

    DESKTOP: {
        id: 2,
        name: 'Desktop'
    }
};

IntelligenceWebClient.constant('VIEWPORTS', VIEWPORTS);
