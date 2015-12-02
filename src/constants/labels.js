const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

const LABELS_IDS = {

    1: 'KL',
    2: 'CB',
    3: 'CC',
    4: 'HT'
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
    }
};

IntelligenceWebClient.constant('LABELS_IDS', LABELS_IDS);
IntelligenceWebClient.constant('LABELS', LABELS);

export default {
    LABELS_IDS,
    LABELS
};
