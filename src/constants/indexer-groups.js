const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

const ALLOCATION_TYPES = {
    PRIORITY_NORMAL: {
        id: 'priority+1',
        display: 'Allowed'
    },
    PRIORITY_HIGH: {
        id: 'priority+2',
        display: 'High Priority'
    },
    PRIORITY_HIGHEST: {
        id: 'priority+3',
        display: 'Highest Priority'
    },
    KROSSOVER_LITE: {
        id: 'label+1',
        display: 'Krossover Lite'
    },
    COACH_BREAKDOWN: {
        id: 'label+2',
        display: 'Coach Breakdown'
    },
    COACH_COMPLAINT: {
        id: 'label+3',
        display: 'Coach Complaint'
    },
    HYPER_TURNAROUND: {
        id: 'label+4',
        display: 'Hyper Turnaround'
    },
    CUSTOM_1: {
        id: 'label+5',
        display: 'Custom 1'
    },
    CUSTOM_2: {
        id: 'label+6',
        display: 'Custom 2'
    },
    URGENCY_LATE: {
        id: 'urgency+late',
        display: 'Late'
    },
    URGENCY_NEAR_DEADLINE: {
        id: 'urgency+near-deadline',
        display: '<2hrs'
    }
};

IntelligenceWebClient.constant('ALLOCATION_TYPES', ALLOCATION_TYPES);
