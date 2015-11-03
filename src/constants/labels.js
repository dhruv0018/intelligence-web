const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

const LABELS_IDS = {

    1: 'KL',
    2: 'CB',
    3: 'C1',
    4: 'C2'
};

const LABELS = {

    'KL': {
        id: 1,
        name: 'Krossover Lite',
        abbreviation: 'KL'
    },

    'CB': {
        id: 2,
        name: 'Coach Breakdown',
        abbreviation: 'CB'
    },

    'C1': {
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

IntelligenceWebClient.constant('LABELS_IDS', LABELS_IDS);
IntelligenceWebClient.constant('LABELS', LABELS);

export default {
    LABELS_IDS,
    LABELS
};
