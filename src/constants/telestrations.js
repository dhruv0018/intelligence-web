var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);


/* Telestration Constants */

var TELESTRATION_TYPES = {
    'ARROW_SOLID': 1,
    'ARROW_DASHED': 2,
    'FREEHAND_SOLID': 3,
    'FREEHAND_DASHED': 4,
    'T_BAR_SOLID': 5,
    'T_BAR_DASHED': 6,
    'CIRCLE_SOLID': 7,
    'CIRCLE_SPOTLIGHT': 8,
    'CONE_SPOTLIGHT': 9,
    'TEXT': 10,
    'EMOJI': 11
};

var TELESTRATION_COLORS = {
    'PRIMARY':  {
        hex: '#F3F313',
        rgb: '243,243,21',
        name: 'neon yellow'
    },
    'SECONDARY_FIRST': {
        hex: '#0DD5FC',
        rgb: '13,213,252',
        name: 'neon blue'
    },
    'SECONDARY_SECOND': {
        hex: '#FF0099',
        rgb: '255,0,153',
        name: 'neon pink'
    },
    'SECONDARY_THIRD': {
        hex: '#83F52C',
        rgb: '131,245,44',
        name: 'neon green'
    }
};

IntelligenceWebClient.value('TELESTRATION_TYPES', TELESTRATION_TYPES);
IntelligenceWebClient.value('TELESTRATION_COLORS', TELESTRATION_COLORS);
