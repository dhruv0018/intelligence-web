const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

const ASSOC_TYPES = [
    'Scholastic',
    'Recreational',
    'Coaching',
    'Sports',
    'Promotional',
    'International',
    'Other'
];

IntelligenceWebClient.constant('ASSOC_TYPES', ASSOC_TYPES);

const ASSOC_AGE_LEVELS = [
    'Primary',
    'Secondary',
    'Collegeiate',
    'Adult',
    'All Ages'
];

IntelligenceWebClient.constant('ASSOC_AGE_LEVELS', ASSOC_AGE_LEVELS);

const ASSOC_AMATEUR_STATUSES = [
    'Amateur',
    'Pro',
    'Both'
];

IntelligenceWebClient.constant('ASSOC_AMATEUR_STATUSES', ASSOC_AMATEUR_STATUSES);
