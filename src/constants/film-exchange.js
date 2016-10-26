const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

const EXCHANGE_TYPES = {
    'BREAKDOWN_LIBRARY': 'breakdown_library',
    'FILM_EXCHANGE': 'film_exchange'
};

IntelligenceWebClient.constant('EXCHANGE_TYPES', EXCHANGE_TYPES);
