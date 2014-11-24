var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var ARENA_TYPES = {

    1: {
        name: 'High School Basketball',
        svg: 'hs-arena'
    },

    2: {
        name: 'NCAA Basketball',
        svg: 'ncaa-arena'
    },

    3: {
        name: 'NBA Basketball',
        svg: 'nba-arena'
    },

    4: {
        name: 'FIBA Basketball',
        svg: 'fiba-arena'
    },

    5: {
        name: 'Men\'s Outdoor Lacrosse',
        svg: 'mens-outdoor-lax-arena'
    },

    6: {
        name: 'Women\'s Outdoor Lacrosse',
        svg: 'womens-outdoor-lax-arena'
    }

};

IntelligenceWebClient.constant('ARENA_TYPES', ARENA_TYPES);
