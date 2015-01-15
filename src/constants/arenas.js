var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

// This map is keyed by arena id's, usually off of the league object

var ARENA_TYPES = {

    1: {
        id: 1,
        name: 'High School Basketball',
        type: 'BASKETBALL_HS'
    },

    2: {
        id: 2,
        name: 'NCAA Basketball',
        type: 'BASKETBALL_NCAA'
    },

    3: {
        id: 3,
        name: 'NBA Basketball',
        type: 'BASKETBALL_NBA'
    },

    4: {
        id: 4,
        name: 'FIBA Basketball',
        type: 'BASKETBALL_FIBA'
    },

    5: {
        id: 5,
        name: 'Men\'s Outdoor Lacrosse',
        type: 'LACROSSE_MENS_OUTDOOR'
    },

    6: {
        id: 6,
        name: 'Women\'s Outdoor Lacrosse',
        type: 'LACROSSE_WOMENS_OUTDOOR'
    },

    7: {
        id: 7,
        name: 'Football',
        type: 'FOOTBALL'
    }

};

IntelligenceWebClient.constant('ARENA_TYPES', ARENA_TYPES);

var ARENA_REGIONS = {

    BASKETBALL: {

        'AROUND_THE_RIM': {
            id: 1,
            name: 'Around the Rim',
            description: 'around the rim'
        },

        'INSIDE_THE_PAINT': {
            id: 2,
            name: 'Inside the Paint',
            description: 'from inside the paint'
        },

        'MID_RANGE': {
            id: 3,
            name: 'Mid-Range',
            description: 'at mid-range'
        },

        'BEHIND_THE_ARC': {
            id: 4,
            name: 'Behind the Arc',
            description: 'from behind the arc'
        }
    },

    LACROSSE: {

        'HOLE': {
            id: 1,
            name: 'Hole',
            description: 'from the hole'
        },

        'SLOT': {
            id: 2,
            name: 'Slot',
            description: 'from the slot'
        },

        'PORCH': {
            id: 3,
            name: 'Porch',
            description: 'from the porch'
        },

        'FLANKS': {
            id: 4,
            name: 'Flanks',
            description: 'from the flanks'
        },

        'PERIMETER': {
            id: 5,
            name: 'PERIMETER',
            description: 'from the perimeter'
        }
    }
};

IntelligenceWebClient.constant('ARENA_REGIONS', ARENA_REGIONS);
