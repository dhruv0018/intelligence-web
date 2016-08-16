var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var STAT_TYPES = {

    GAME: 1,
    TEAM: 2,
    PLAYER: 3
};

IntelligenceWebClient.constant('STAT_TYPES', STAT_TYPES);
