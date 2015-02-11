var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);


/* Telestration Constants */

var TELESTRATION_TYPES = {
    'FREEHAND': 1,
    'ARROW': 2,
    'T_BAR': 3,
    'CIRCLE': 4,
    'CIRCLE_SPOTLIGHT': 5,
    'CONE_SPOTLIGHT': 6,
    'TEXT_TOOL': 7
};

IntelligenceWebClient.value('TELESTRATION_TYPES', TELESTRATION_TYPES);
