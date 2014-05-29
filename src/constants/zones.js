var package = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(package.name);

var ZONE_IDS = {

    1: 'LOSS_FAR_LEFT',
    2: 'LOSS_LEFT',
    3: 'LOSS_MIDDLE',
    4: 'LOSS_RIGHT',
    5: 'LOSS_FAR_RIGHT',
    6: 'LEFT_FLAT',
    7: 'HOLE_MIDDLE',
    8: 'RIGHT_HOOK',
    9: 'RIGHT_FLAT',
    10: 'LEFT',
    11: 'MIDDLE',
    12: 'RIGHT',
    13: 'DEEP_LEFT',
    14: 'DEEP_MIDDLE',
    15: 'DEEP_RIGHT'
};

IntelligenceWebClient.constant('ZONE_IDS', ZONE_IDS);

var ZONES = {

    LOSS_FAR_LEFT: {
        name: 'Loss Far Left',
        value: 1,
        shortcut: 'FL'
    },
    LOSS_LEFT: {
        name: 'Loss Left',
        value: 2,
        shortcut: 'LL'
    },
    LOSS_MIDDLE: {
        name: 'Loss Middle',
        value: 3,
        shortcut: 'LM'
    },
    LOSS_RIGHT: {
        name: 'Loss Right',
        value: 4,
        shortcut: 'LR'
    },
    LOSS_FAR_RIGHT: {
        name: 'Loss Far Right',
        value: 5,
        shortcut: 'FR'
    },
    LEFT_FLAT: {
        name: 'Left Flat',
        value: 6,
        shortcut: 'LF'
    },
    HOLE_MIDDLE: {
        name: 'Hole Middle',
        value: 7,
        shortcut: 'HM'
    },
    RIGHT_HOOK: {
        name: 'Right Hook',
        value: 8,
        shortcut: 'RH'
    },
    RIGHT_FLAT: {
        name: 'Right Flat',
        value: 9,
        shortcut: 'RF'
    },
    LEFT: {
        name: 'Left',
        value: 10,
        shortcut: 'L'
    },
    MIDDLE: {
        name: 'Middle',
        value: 11,
        shortcut: 'M'
    },
    RIGHT: {
        name: 'Right',
        value: 12,
        shortcut: 'R'
    },
    DEEP_LEFT: {
        name: 'Deep Left',
        value: 13,
        shortcut: 'DL'
    },
    DEEP_MIDDLE: {
        name: 'Deep Middle',
        value: 14,
        shortcut: 'DM'
    },
    DEEP_RIGHT: {
        name: 'Deep Middle',
        value: 15,
        shortcut: 'DR'
    }
};

IntelligenceWebClient.constant('ZONES', ZONES);

