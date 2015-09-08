var pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var GAP_IDS = {

    '1': 'D_LEFT',
    '2': 'C_LEFT',
    '3': 'B_LEFT',
    '4': 'A_LEFT',
    '5': 'A_RIGHT',
    '6': 'B_RIGHT',
    '7': 'C_RIGHT',
    '8': 'D_RIGHT'
};

IntelligenceWebClient.constant('GAP_IDS', GAP_IDS);

var GAPS = {

    D_LEFT: {
        name: 'D Left',
        value: '1',
        shortcut: 'DL'
    },
    C_LEFT: {
        name: 'C Left',
        value: '2',
        shortcut: 'CL'
    },
    B_LEFT: {
        name: 'B Left',
        value: '3',
        shortcut: 'BL'
    },
    A_LEFT: {
        name: 'A Left',
        value: '4',
        shortcut: 'AL'
    },
    A_RIGHT: {
        name: 'A Right',
        value: '5',
        shortcut: 'AR'
    },
    B_RIGHT: {
        name: 'B Right',
        value: '6',
        shortcut: 'BR'
    },
    C_RIGHT: {
        name: 'C Right',
        value: '7',
        shortcut: 'CR'
    },
    D_RIGHT: {
        name: 'D Right',
        value: '8',
        shortcut: 'DR'
    }
};

IntelligenceWebClient.constant('GAPS', GAPS);
export default {GAPS, GAP_IDS};
