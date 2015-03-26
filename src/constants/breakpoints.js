// CommonJS module to share constant values
// across Angular resources
module.exports = {

    MOBILE: module.exports.mobile,
    MD_SCREEN_SM: module.exports.mdScreenSm,
    MD_SCREEN_MD: module.exports.mdScreenMd,
    MD_SCREEN_LG: module.exports.mdScreenLg
};

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.constant('BREAKPOINTS', module.exports);
