const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

const PRIORITIES_IDS = {

    1: 'NORMAL',
    2: 'HIGH',
    3: 'HIGHEST'
};

const PRIORITIES = {

    'NORMAL': {
        id: 1,
        name: 'Normal Priority (Default)',
        value: 0
    },

    'HIGH': {
        id: 2,
        name: 'High Priority',
        value: 1
    },

    'HIGHEST': {
        id: 3,
        name: 'Highest Priority',
        value: 2
    }
};

const PRIORITY_LIST = [
    PRIORITIES.NORMAL,
    PRIORITIES.HIGH,
    PRIORITIES.HIGHEST
];

IntelligenceWebClient.constant('PRIORITIES_IDS', PRIORITIES_IDS);
IntelligenceWebClient.constant('PRIORITIES', PRIORITIES);
IntelligenceWebClient.constant('PRIORITY_LIST', PRIORITY_LIST);

export default {
    PRIORITIES_IDS,
    PRIORITIES
};
