const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const FEATURE_FLAG_TYPES = {

    'SELF': 'SELF', // (the feature is flagged and the feature should handle the corresponding behavior)
    'AUTO': 'AUTO' // (the feature is flagged and the feature will have a predetermined hide implementation)
};

IntelligenceWebClient.constant('FEATURE_FLAG_TYPES', FEATURE_FLAG_TYPES);
