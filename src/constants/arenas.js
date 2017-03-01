var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

// This map is keyed by arena id's, usually off of the league object
var ARENA_TYPES = {

    /**
     * FIXME:
     * Refactor to use semantic  ID's
     * e.g. BASKETBALL_HS
     * See GAME_STATUSES for format
     */
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
    },

    9: {
        id: 9,
        name: 'Ice Hockey',
        type: 'ICE_HOCKEY',
        orientation: 'landscape'
    },

    10: {
        id: 10,
        name: 'V1 Basketball',
        type: 'BASKETBALL_V1',
        orientation: 'landscape'
    },

    11: {
        id: 11,
        name: 'Soccer',
        type: 'SOCCER',
        orientation: 'landscape'
    },
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
    8: 'VOLLEYBALL',
    9: 'ICE_HOCKEY',
    10: 'BASKETBALL_V1',
    11: 'SOCCER'
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

    BASKETBALL_V1: {

        'COURT': {
            id: 17,
            name: 'Court',
            description: 'the court'
        }
    },

    LACROSSE: {

        'HOLE': {
            id: 5,
            name: 'Crease',
            description: 'from the hole'
        },

        'SLOT': {
            id: 6,
            name: 'Wing',
            description: 'from the slot'
        },

        'PORCH': {
            id: 7,
            name: 'Top of the Box',
            description: 'from the porch'
        },

        'FLANKS': {
            id: 8,
            name: 'X',
            description: 'from the flanks'
        },

        'PERIMETER': {
            id: 9,
            name: 'Perimeter',
            description: 'from the perimeter'
        }
    },

    VOLLEYBALL: {

        'COURT': {
            id: 10,
            name: 'Court',
            description: 'the court'
        }
    },

    ICE_HOCKEY: {

        'BEHIND_THE_NET': {
            id: 11,
            name: 'Behind the net',
            description: 'from behind the net'
        },
        'AROUND_THE_NET': {
            id: 12,
            name: 'Around the net',
            description: 'around the net'
        },
        'SLOT': {
            id: 13,
            name: 'Slot',
            description: 'from the slot'
        },
        'WING': {
            id: 14,
            name: 'Wing',
            description: 'from the wing'
        },
        'BLUE_LINE': {
            id: 15,
            name: 'Blue line',
            description: 'from the blue line'
        },
        'OUTSIDE_THE_ZONE': {
            id: 16,
            name: 'Outside the zone',
            description: 'from outside the zone'
        }
    },

    SOCCER: {

        'SIX_YARD_BOX': {
            id: 18,
            name: '6 Yard Box',
            description: '6 Yard Box'
        },
        'PENALTY_AREA': {
            id: 19,
            name: 'Penalty Area',
            description: 'Penalty Area'
        },
        'OUT_OF_BOX': {
            id: 20,
            name: 'Outside of Box',
            description: 'Outside of Box'
        }
    }
};

IntelligenceWebClient.constant('ARENA_REGIONS', ARENA_REGIONS);

var ARENA_REGIONS_BY_ID = {

    1: ARENA_REGIONS.BASKETBALL.AROUND_THE_RIM,
    2: ARENA_REGIONS.BASKETBALL.INSIDE_THE_PAINT,
    3: ARENA_REGIONS.BASKETBALL.MID_RANGE,
    4: ARENA_REGIONS.BASKETBALL.BEHIND_THE_ARC,
    5: ARENA_REGIONS.LACROSSE.HOLE,
    6: ARENA_REGIONS.LACROSSE.SLOT,
    7: ARENA_REGIONS.LACROSSE.PORCH,
    8: ARENA_REGIONS.LACROSSE.FLANKS,
    9: ARENA_REGIONS.LACROSSE.PERIMETER,
    10: ARENA_REGIONS.VOLLEYBALL.COURT,
    11: ARENA_REGIONS.ICE_HOCKEY.BEHIND_THE_NET,
    12: ARENA_REGIONS.ICE_HOCKEY.AROUND_THE_NET,
    13: ARENA_REGIONS.ICE_HOCKEY.SLOT,
    14: ARENA_REGIONS.ICE_HOCKEY.WING,
    15: ARENA_REGIONS.ICE_HOCKEY.BLUE_LINE,
    16: ARENA_REGIONS.ICE_HOCKEY.OUTSIDE_THE_ZONE,
    17: ARENA_REGIONS.BASKETBALL_V1.COURT,
    18: ARENA_REGIONS.SOCCER.SIX_YARD_BOX,
    19: ARENA_REGIONS.SOCCER.PENALTY_AREA,
    20: ARENA_REGIONS.SOCCER.OUT_OF_BOX
};

IntelligenceWebClient.constant('ARENA_REGIONS_BY_ID', ARENA_REGIONS_BY_ID);
export default ARENA_REGIONS_BY_ID;
