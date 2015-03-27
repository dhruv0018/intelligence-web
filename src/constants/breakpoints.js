// CommonJS module to share constant values
// across Angular resources
module.exports = {

    MOBILE: 1024,
    MD_SCREEN_SM: 600,
    MD_SCREEN_MD: 960,
    MD_SCREEN_LG: 1200
};

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.constant('BREAKPOINTS', module.exports);
