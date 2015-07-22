const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = require('angular');

const IntelligenceWebClient = angular.module(pkg.name);


/* Telestration Constants */

const TELESTRATION_TYPES = {
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

const TELESTRATION_COLORS = {
    GLYPHS: {
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
    },
    BRIGHT_BLUE: function(a=1.0) {
        return `rgba(43, 171, 245, ${a})`;
    },
    HIGHLIGHT_BLUE: function(a=1.0) {
        return `rgba(83, 148, 236, ${a})`;
    },
    DELETE_RED: function(a=1.0) {
        return `rgba(213, 43, 43, ${a})`;
    },
    ACTIVE_GRAY: function(a=1.0) {
        return `rgba(49, 49, 49, ${a})`;
    },
    BORDER_GRAY: function(a=1.0) {
        return `rgba(85, 85, 85, ${a})`;
    },
    WHITE: function(a=1.0) {
        return `rgba(255, 255, 255, ${a})`;
    }
};

const TELESTRATION_PERMISSIONS = {
    EDIT: 2,
    VIEW: 1,
    NO_ACCESS: 0
};

const TELESTRATION_EVENTS = {
    ON_GLYPHS_VISIBLE: 0,
    ENABLE_DRAW: 1,
    DISABLE_DRAW: 2,
    TOGGLED: 3,
    TOOL_TOGGLED: 4
};

IntelligenceWebClient.value('TELESTRATION_TYPES', TELESTRATION_TYPES);
IntelligenceWebClient.value('TELESTRATION_COLORS', TELESTRATION_COLORS);
IntelligenceWebClient.value('TELESTRATION_PERMISSIONS', TELESTRATION_PERMISSIONS);
IntelligenceWebClient.value('TELESTRATION_EVENTS', TELESTRATION_EVENTS);
