var pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var ZONE_IDS = {

    1: 'LOSS_FAR_LEFT',
    2: 'LOSS_LEFT',
    3: 'LOSS_MIDDLE',
    4: 'LOSS_RIGHT',
    5: 'LOSS_FAR_RIGHT',
    6: 'LEFT_FLAT',
    7: 'LEFT_HOOK',
    8: 'HOLE_MIDDLE',
    9: 'RIGHT_HOOK',
    10: 'RIGHT_FLAT',
    11: 'LEFT',
    12: 'MIDDLE',
    13: 'RIGHT',
    14: 'DEEP_LEFT',
    15: 'DEEP_MIDDLE',
    16: 'DEEP_RIGHT'
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
    LEFT_HOOK: {
        name: 'Left Hook',
        value: 7,
        shortcut: 'LH'
    },
    HOLE_MIDDLE: {
        name: 'Hole Middle',
        value: 8,
        shortcut: 'HM'
    },
    RIGHT_HOOK: {
        name: 'Right Hook',
        value: 9,
        shortcut: 'RH'
    },
    RIGHT_FLAT: {
        name: 'Right Flat',
        value: 10,
        shortcut: 'RF'
    },
    LEFT: {
        name: 'Left',
        value: 11,
        shortcut: 'L'
    },
    MIDDLE: {
        name: 'Middle',
        value: 12,
        shortcut: 'M'
    },
    RIGHT: {
        name: 'Right',
        value: 13,
        shortcut: 'R'
    },
    DEEP_LEFT: {
        name: 'Deep Left',
        value: 14,
        shortcut: 'DL'
    },
    DEEP_MIDDLE: {
        name: 'Deep Middle',
        value: 15,
        shortcut: 'DM'
    },
    DEEP_RIGHT: {
        name: 'Deep Right',
        value: 16,
        shortcut: 'DR'
    }
};

IntelligenceWebClient.constant('ZONES', ZONES);

var ZONE_AREAS = {

    LOSS_ZONES: [
        ZONES.LOSS_FAR_LEFT,
        ZONES.LOSS_LEFT,
        ZONES.LOSS_MIDDLE,
        ZONES.LOSS_RIGHT,
        ZONES.LOSS_FAR_RIGHT
    ],

    FLAT_ZONES: [
        ZONES.LEFT_FLAT,
        ZONES.LEFT_HOOK,
        ZONES.HOLE_MIDDLE,
        ZONES.RIGHT_HOOK,
        ZONES.RIGHT_FLAT
    ],

    FORWARD_ZONES: [
        ZONES.LEFT,
        ZONES.MIDDLE,
        ZONES.RIGHT
    ],

    DEEP_ZONES: [
        ZONES.DEEP_LEFT,
        ZONES.DEEP_MIDDLE,
        ZONES.DEEP_RIGHT
    ]
};

IntelligenceWebClient.constant('ZONE_AREAS', ZONE_AREAS);
export default {ZONES, ZONE_IDS};
