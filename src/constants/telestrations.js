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

IntelligenceWebClient.value('TELESTRATION_TYPES', TELESTRATION_TYPES);
