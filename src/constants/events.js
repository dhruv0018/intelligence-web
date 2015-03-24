var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var FIELD_TYPE = {

    TEAM: 'Team',
    PLAYER: 'Player',
    OTHER: null
};

IntelligenceWebClient.constant('FIELD_TYPE', FIELD_TYPE);

