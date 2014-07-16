var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

var TURNAROUND_TIME_RANGES = [
    {
        value: 24,
        name: '12-24'
    },

    {
        value: 36,
        name: '24-36'
    },

    {
        value: 48,
        name: '36-48'
    }
];

var TURNAROUND_TIME_MIN_TIME_LOOKUP = {
    24: 12,
    36: 24,
    48: 36
};

IntelligenceWebClient.constant('TURNAROUND_TIME_RANGES', TURNAROUND_TIME_RANGES);
IntelligenceWebClient.constant('TURNAROUND_TIME_MIN_TIME_LOOKUP', TURNAROUND_TIME_MIN_TIME_LOOKUP);

