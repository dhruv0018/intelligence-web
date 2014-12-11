var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var SPORTS = {

    BASKETBALL: {
        id: 1,
        name: 'Basketball',
        hasStatistics: false
    },

    FOOTBALL: {
        id: 2,
        name: 'Football',
        hasStatistics: true
    },

    LACROSSE: {
        id: 3,
        name: 'Lacrosse',
        hasStatistics: false
    },

    VOLLEYBALL: {
        id: 4,
        name: 'Volleyball',
        hasStatistics: true
    }
};

var SPORT_IDS = {
    1: 'BASKETBALL',
    2: 'FOOTBALL',
    3: 'LACROSSE',
    4: 'VOLLEYBALL'
};

IntelligenceWebClient.constant('SPORT_IDS', SPORT_IDS);
IntelligenceWebClient.constant('SPORTS', SPORTS);
