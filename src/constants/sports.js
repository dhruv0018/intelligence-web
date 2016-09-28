var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var SPORTS = {

    BASKETBALL: {
        id: 1,
        name: 'Basketball',
        hasAnalytics: true,
        hasStatistics: true,
        hasInsights: true,
        scoreBySets: false
    },

    FOOTBALL: {
        id: 2,
        name: 'Football',
        hasAnalytics: true,
        hasStatistics: true,
        hasInsights: true,
        scoreBySets: false
    },

    LACROSSE: {
        id: 3,
        name: 'Lacrosse',
        hasAnalytics: true,
        hasStatistics: true,
        hasInsights: false,
        scoreBySets: false
    },

    VOLLEYBALL: {
        id: 4,
        name: 'Volleyball',
        hasAnalytics: true,
        hasStatistics: true,
        hasInsights: true,
        scoreBySets: true
    },

    SOCCER: {
        id: 5,
        name: 'Soccer',
        hasAnalytics: true,
        hasStatistics: true,
        scoreBySets: false
    }
};

var SPORT_IDS = {
    1: 'BASKETBALL',
    2: 'FOOTBALL',
    3: 'LACROSSE',
    4: 'VOLLEYBALL',
    5: 'SOCCER'
};

IntelligenceWebClient.constant('SPORT_IDS', SPORT_IDS);
IntelligenceWebClient.constant('SPORTS', SPORTS);
