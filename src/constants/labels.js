const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

const LABELS = {

    1: {
        id: 1,
        name: 'Krossover Lite',
        abbreviation: 'KL'
    },

    2: {
        id: 2,
        name: 'Coach Breakdown',
        abbreviation: 'CB'
    },

    3: {
        id: 3,
        name: 'Custom 1',
        abbreviation: 'C1'
    },

    4: {
        id: 4,
        name: 'Custom 2',
        abbreviation: 'C2'
    }
};

IntelligenceWebClient.constant('LABELS', LABELS);

export default LABELS;
