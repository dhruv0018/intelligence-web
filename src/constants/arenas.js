var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var ARENA_TYPES_IDS = {
    1: 'BASKETBALL_HS',
    2: 'BASKETBALL_NCAA',
    3: 'BASKETBALL_NBA',
    4: 'BASKETBALL_FIBA',
    5: 'LACROSSE_MENS_OUTDOOR',
    6: 'LACROSSE_WOMENS_OUTDOOR',
    7: 'FOOTBALL'
};

IntelligenceWebClient.constant('ARENA_TYPES_IDS', ARENA_TYPES_IDS);

var ARENA_TYPES = {

    BASKETBALL_HS: {
        id: 1,
        name: 'High School Basketball',
        type: 'BASKETBALL_HS'
    },

    BASKETBALL_NCAA: {
        id: 2,
        name: 'NCAA Basketball',
        type: 'BASKETBALL_NCAA'
    },

    BASKETBALL_NBA: {
        id: 3,
        name: 'NBA Basketball',
        type: 'BASKETBALL_NBA'
    },

    BASKETBALL_FIBA: {
        id: 4,
        name: 'FIBA Basketball',
        type: 'BASKETBALL_FIBA'
    },

    LACROSSE_MENS_OUTDOOR: {
        id: 5,
        name: 'Men\'s Outdoor Lacrosse',
        type: 'LACROSSE_MENS_OUTDOOR'
    },

    LACROSSE_WOMENS_OUTDOOR: {
        id: 6,
        name: 'Women\'s Outdoor Lacrosse',
        type: 'LACROSSE_WOMENS_OUTDOOR'
    },

    FOOTBALL: {
        id: 7,
        name: 'Football',
        type: 'FOOTBALL'
    }

};

IntelligenceWebClient.constant('ARENA_TYPES', ARENA_TYPES);
