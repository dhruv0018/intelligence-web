const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const OUTCOME = {
    'MADE': 0,
    'MISSED': 1,
    'BLOCKED': 2,
    'SAVED': 3
};

const OUTCOME_IDS = {
    0: 'MADE',
    1: 'MISSED',
    2: 'BLOCKED',
    3: 'SAVED'
};

const ARENA_EVENTS = {
    OUTCOME,
    OUTCOME_IDS
};

const ARENA_CHART = {
    ARENA_EVENTS
};

export default ARENA_CHART;
IntelligenceWebClient.constant('ARENA_CHART', ARENA_CHART);
