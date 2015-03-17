// CommonJS module to share constant values
// across Angular resources
var breakpoints = {
    mobile: 1024,
    mdScreenSm: 600,
    mdScreenMd: 960,
    mdScreenLg: 1200
};
module.exports = breakpoints;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

// Values in px
var BREAKPOINTS = {

    MOBILE: breakpoints.mobile,
    MD_SCREEN_SM: breakpoints.mdScreenSm,
    MD_SCREEN_MD: breakpoints.mdScreenMd,
    MD_SCREEN_LG: breakpoints.mdScreenLg
};

IntelligenceWebClient.constant('BREAKPOINTS', BREAKPOINTS);
