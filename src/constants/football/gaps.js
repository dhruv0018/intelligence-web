var package = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

var GAP_IDS = {

    '-4': 'D_LEFT',
    '-3': 'C_LEFT',
    '-2': 'B_LEFT',
    '-1': 'A_LEFT',
    '1': 'A_RIGHT',
    '2': 'B_RIGHT',
    '3': 'C_RIGHT',
    '4': 'D_RIGHT'
};

IntelligenceWebClient.constant('GAP_IDS', GAP_IDS);

var GAPS = {

    D_LEFT: {
        name: 'D Left',
        value: '-4',
        shortcut: 'DL'
    },
    C_LEFT: {
        name: 'C Left',
        value: '-3',
        shortcut: 'CL'
    },
    B_LEFT: {
        name: 'B Left',
        value: '-2',
        shortcut: 'BL'
    },
    A_LEFT: {
        name: 'A Left',
        value: '-1',
        shortcut: 'AL'
    },
    A_RIGHT: {
        name: 'A Right',
        value: '1',
        shortcut: 'AR'
    },
    B_RIGHT: {
        name: 'B Right',
        value: '2',
        shortcut: 'BR'
    },
    C_RIGHT: {
        name: 'C Right',
        value: '3',
        shortcut: 'CR'
    },
    D_RIGHT: {
        name: 'D Right',
        value: '4',
        shortcut: 'DR'
    }
};

IntelligenceWebClient.constant('GAPS', GAPS);

