var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var HOURS = {

    QA_PICKUP: {

        DEADLINE_PASSED: 6
    },

};

IntelligenceWebClient.constant('HOURS', HOURS);
