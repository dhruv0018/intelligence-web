const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const CUE_POINT_EVENTS = {
    'TELESTRATION': 0,
    'EVENT': 1
};

const CUEPOINT_TYPES = {
    'TELESTRATION': 0,
    'EVENT': 1
};

const CUE_POINT_TYPE_LABELS = [
    'TELESTRATION',
    'EVENT'
];

const CUEPOINT_CONSTANTS = {
    'MAX_TIME_DELTA': 0.2 // seconds
};

IntelligenceWebClient.constant('CUEPOINT_TYPES', CUEPOINT_TYPES);
IntelligenceWebClient.constant('CUE_POINT_TYPE_LABELS', CUE_POINT_TYPE_LABELS);
IntelligenceWebClient.constant('CUEPOINT_CONSTANTS', CUEPOINT_CONSTANTS);
IntelligenceWebClient.constant('CUE_POINT_EVENTS', CUE_POINT_EVENTS);
