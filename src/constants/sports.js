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
        hasInsights: true,
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
    },

    ICE_HOCKEY: {
        id: 6,
        name: 'Ice Hockey'
    },

    BASEBALL: {
        id: 7,
        name: 'Baseball'
    },

    TENNIS: {
        id: 8,
        name: 'Tennis'
    },

    FIELD_HOCKEY: {
        id: 9,
        name: 'Field Hockey'
    },

    WRESTLING: {
        id: 10,
        name: 'Wrestling'
    },

    TRACK_AND_FIELD: {
        id: 11,
        name: 'Track & Field'
    },

    RUGBY: {
        id: 12,
        name: 'Rugby'
    },

    SOFTBALL: {
        id: 13,
        name: 'Softball'
    },

    WATER_POLO: {
        id: 14,
        name: 'Water Polo'
    },

    CRICKET: {
        id: 15,
        name: 'Cricket'
    },

    BOXING: {
        id: 16,
        name: 'Boxing'
    },

    CHEERLEADING: {
        id: 17,
        name: 'Cheerleading'
    },

    GOLF: {
        id: 18,
        name: 'Golf'
    },

    ARCHERY: {
        id: 19,
        name: 'Archery'
    },

    BADMINTON: {
        id: 20,
        name: 'Badminton'
    },

    CANOE_SLALOM: {
        id: 21,
        name: 'Canoe Slalom'
    },

    CANOE_SPRINT: {
        id: 22,
        name: 'Canoe Sprint'
    },

    CYCLING_BMX: {
        id: 23,
        name: 'Cycling - BMX'
    },

    CYCLING_MOUNTAIN_BIKE: {
        id: 24,
        name: 'Cycling - Mountain Bike'
    },

    CYCLING_ROAD: {
        id: 25,
        name: 'Cycling - Road'
    },

    CYCLING_TRACK: {
        id: 26,
        name: 'Cycling - Track'
    },

    DIVING: {
        id: 27,
        name: 'Diving'
    },

    EQUESTRIAN: {
        id: 28,
        name: 'Equestrian'
    },

    FENCING: {
        id: 29,
        name: 'FENCING'
    },

    GYMNASTICS: {
        id: 30,
        name: 'Gymnastics'
    },

    HANDBALL: {
        id: 31,
        name: 'Handball'
    },

    JUDO: {
        id: 32,
        name: 'Judo'
    },

    MARATHON_SWIMMING: {
        id: 33,
        name: 'Marathon Swimming'
    },

    MODERN_PENTATHLON: {
        id: 34,
        name: 'Modern Pentathlon'
    },

    ROWING: {
        id: 35,
        name: 'Rowing'
    },

    SAILING: {
        id: 36,
        name: 'Sailing'
    },

    SHOOTING: {
        id: 37,
        name: 'Shooting'
    },

    SWIMMING: {
        id: 38,
        name: 'Swimming'
    },

    SYNCHRONIZED_SWIMMING: {
        id: 39,
        name: 'Synchronized Swimming'
    },

    TABLE_TENNIS: {
        id: 40,
        name: 'Table Tennis'
    },

    TAEKWONDO: {
        id: 41,
        name: 'Taekwondo'
    },

    TRAMPOLINE: {
        id: 42,
        name: 'Trampoline'
    },

    TRIATHLON: {
        id: 43,
        name: 'Triathlon'
    },

    WEIGHTLIFTING: {
        id: 44,
        name: 'Weightlifting'
    },

    SURFING: {
        id: 45,
        name: 'Surfing'
    },

    CURLING: {
        id: 46,
        name: 'Curling'
    },

    LUGE: {
        id: 47,
        name: 'Luge'
    },

    SNOWBOARDING: {
        id: 48,
        name: 'Snowboarding'
    },

    BOBSLEIGH: {
        id: 49,
        name: 'Bobsleigh'
    },

    SKELETON: {
        id: 50,
        name: 'Skeleton'
    },

    BIATHLON: {
        id: 51,
        name: 'Biathlon'
    },

    FIGURE_SKATING: {
        id: 52,
        name: 'Figure Skating'
    },

    NORDIC_COMBINED: {
        id: 53,
        name: 'Nordic Combined'
    },

    SPEED_SKATING: {
        id: 54,
        name: 'Speed Skating'
    },

    SKIING: {
        id: 55,
        name: 'Skiing'
    },

    SKI_JUMPING: {
        id: 56,
        name: 'Ski Jumping'
    },

    MIXED_MARTIAL_ARTS: {
        id: 57,
        name: 'Mixed Martial Arts'
    },

    E_SPORTS: {
        id: 58,
        name: 'E-Sports'
    }
};

var SPORT_IDS = {
    1: 'BASKETBALL',
    2: 'FOOTBALL',
    3: 'LACROSSE',
    4: 'VOLLEYBALL',
    5: 'SOCCER',
    6: 'ICE_HOCKEY',
    7: 'BASEBALL',
    8: 'TENNIS',
    9: 'FIELD_HOCKEY',
    10: 'WRESTLING',
    11: 'TRACK_AND_FIELD',
    12: 'RUGBY',
    13: 'SOFTBALL',
    14: 'WATER_POLO',
    15: 'CRICKET',
    16: 'BOXING',
    17: 'CHEERLEADING',
    18: 'GOLF',
    19: 'ARCHERY',
    20: 'BADMINTON',
    21: 'CANOE_SLALOM',
    22: 'CANOE_SPRINT',
    23: 'CYCLING_BMX',
    24: 'CYCLING_MOUNTAIN_BIKE',
    25: 'CYCLING_ROAD',
    26: 'CYCLING_TRACK',
    27: 'DIVING',
    28: 'EQUESTRIAN',
    29: 'FENCING',
    30: 'GYMNASTICS',
    31: 'HANDBALL',
    32: 'JUDO',
    33: 'MARATHON_SWIMMING',
    34: 'MODERN_PENTATHLON',
    35: 'ROWING',
    36: 'SAILING',
    37: 'SHOOTING',
    38: 'SWIMMING',
    39: 'SYNCHRONIZED_SWIMMING',
    40: 'TABLE_TENNIS',
    41: 'TAEKWONDO',
    42: 'TRAMPOLINE',
    43: 'TRIATHLON',
    44: 'WEIGHTLIFTING',
    45: 'SURFING',
    46: 'CURLING',
    47: 'LUGE',
    48: 'SNOWBOARDING',
    49: 'BOBSLEIGH',
    50: 'SKELETON',
    51: 'BIATHLON',
    52: 'FIGURE_SKATING',
    53: 'NORDIC_COMBINED',
    54: 'SPEED_SKATING',
    55: 'SKIING',
    56: 'SKI_JUMPING',
    57: 'MIXED_MARTIAL_ARTS',
    58: 'E_SPORTS'
};

IntelligenceWebClient.constant('SPORT_IDS', SPORT_IDS);
IntelligenceWebClient.constant('SPORTS', SPORTS);
