var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

// This map is keyed by arena id's, usually off of the league object

var ARENA_TYPES = {

    1: {
        id: 1,
        name: 'High School Basketball',
        type: 'BASKETBALL_HS',
        orientation: 'landscape'
    },

    2: {
        id: 2,
        name: 'NCAA Basketball',
        type: 'BASKETBALL_NCAA',
        orientation: 'landscape'
    },

    3: {
        id: 3,
        name: 'NBA Basketball',
        type: 'BASKETBALL_NBA',
        orientation: 'landscape'
    },

    4: {
        id: 4,
        name: 'FIBA Basketball',
        type: 'BASKETBALL_FIBA',
        orientation: 'landscape'
    },

    5: {
        id: 5,
        name: 'Men\'s Outdoor Lacrosse',
        type: 'LACROSSE_MENS_OUTDOOR',
        orientation: 'landscape'
    },

    6: {
        id: 6,
        name: 'Women\'s Outdoor Lacrosse',
        type: 'LACROSSE_WOMENS_OUTDOOR',
        orientation: 'landscape'
    },

    7: {
        id: 7,
        name: 'Football',
        type: 'FOOTBALL',
        orientation: 'landscape'
    },

    8: {
        id: 8,
        name: 'Volleyball',
        type: 'VOLLEYBALL',
        orientation: 'portrait'
    }
};

IntelligenceWebClient.constant('ARENA_TYPES', ARENA_TYPES);

var ARENA_IDS = {

    1: 'BASKETBALL',
    2: 'BASKETBALL',
    3: 'BASKETBALL',
    4: 'BASKETBALL',
    5: 'LACROSSE',
    6: 'LACROSSE',
    7: 'FOOTBALL',
    8: 'VOLLEYBALL'
};

IntelligenceWebClient.constant('ARENA_IDS', ARENA_IDS);

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
            id: 5,
            name: 'Hole',
            description: 'from the hole'
        },

        'SLOT': {
            id: 6,
            name: 'Slot',
            description: 'from the slot'
        },

        'PORCH': {
            id: 7,
            name: 'Porch',
            description: 'from the porch'
        },

        'FLANKS': {
            id: 8,
            name: 'Flanks',
            description: 'from the flanks'
        },

        'PERIMETER': {
            id: 9,
            name: 'PERIMETER',
            description: 'from the perimeter'
        }
    },

    VOLLEYBALL: {
        'COURT': {
            id: 10,
            name: 'Court',
            description: 'the court'
        }
    }
};

IntelligenceWebClient.constant('ARENA_REGIONS', ARENA_REGIONS);

var ARENA_REGIONS_BY_ID = {
    1: {
        id: 1,
        name: 'Around the Rim',
        description: 'around the rim'
    },
    2: {
        id: 2,
        name: 'Inside the Paint',
        description: 'from inside the paint'
    },
    3: {
        id: 3,
        name: 'Mid-Range',
        description: 'at mid-range'
    },
    4: {
        id: 4,
        name: 'Behind the Arc',
        description: 'from behind the arc'
    },
    5: {
        id: 5,
        name: 'Hole',
        description: 'from the hole'
    },
    6: {
        id: 6,
        name: 'Slot',
        description: 'from the slot'
    },
    7: {
        id: 7,
        name: 'Porch',
        description: 'from the porch'
    },
    8: {
        id: 8,
        name: 'Flanks',
        description: 'from the flanks'
    },
    9: {
        id: 9,
        name: 'PERIMETER',
        description: 'from the perimeter'
    },
    10: {
        id: 10,
        name: 'Court',
        description: 'the court'
    }
};

IntelligenceWebClient.constant('ARENA_REGIONS_BY_ID', ARENA_REGIONS_BY_ID);
export default ARENA_REGIONS_BY_ID;
