// CommonJS module to share constant values
// across Angular resources
module.exports = {
    mobile: 1024,
    mdScreenSm: 600,
    mdScreenMd: 960,
    mdScreenLg: 1200
};

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

// Values in px
var BREAKPOINTS = {

    MOBILE: module.exports.mobile,
    MD_SCREEN_SM: module.exports.mdScreenSm,
    MD_SCREEN_MD: module.exports.mdScreenMd,
    MD_SCREEN_LG: module.exports.mdScreenLg
};

IntelligenceWebClient.constant('BREAKPOINTS', BREAKPOINTS);
