const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

const KEYBOARD_CODES = {
    ENTER: 13,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40
};

IntelligenceWebClient.constant('KEYBOARD_CODES', KEYBOARD_CODES);
