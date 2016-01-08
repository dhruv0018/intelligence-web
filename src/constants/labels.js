const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

const LABELS_IDS = {

    1: 'KL',
    2: 'CB',
    3: 'CC',
    4: 'HT',
    5: 'C1',
    6: 'C2'
};

const LABELS = {

    'KL': {
        id: 1,
        name: 'Krossover Lite',
        abbreviation: 'KL',
        index: 1
    },

    'CB': {
        id: 2,
        name: 'Coach Breakdown',
        abbreviation: 'CB',
        index: 0
    },

    'CC': {
        id: 3,
        name: 'Coach Complaint',
        abbreviation: 'CC',
        index: 2
    },

    'HT': {
        id: 4,
        name: 'Hyper Turnaround',
        abbreviation: 'HT',
        index: 3
    },

    'C1': {
        id: 5,
        name: 'Custom 1',
        abbreviation: 'C1',
        index: 4
    },

    'C2': {
        id: 6,
        name: 'Custom 2',
        abbreviation: 'C2',
        index: 5
    }
};

IntelligenceWebClient.constant('LABELS_IDS', LABELS_IDS);
IntelligenceWebClient.constant('LABELS', LABELS);

export default {
    LABELS_IDS,
    LABELS
};
