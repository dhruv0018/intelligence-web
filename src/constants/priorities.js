const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

const PRIORITIES = {

    1: {
        id: 1,
        name: 'Normal Priority',
        value: 0
    },

    2: {
        id: 2,
        name: 'High Priority',
        value: 1
    },

    3: {
        id: 3,
        name: 'Highest Priority',
        value: 2
    }
};

IntelligenceWebClient.constant('PRIORITIES', PRIORITIES);

export default PRIORITIES;
