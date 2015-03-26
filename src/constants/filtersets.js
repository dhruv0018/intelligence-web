var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var FILTERSET_CATEGORIES = {
    1: {
        id: 1,
        name: 'Players'
    },
    2: {
        id: 2,
        name: 'Offensive Plays'
    },
    3: {
        id: 3,
        name: 'Defensive Plays'
    },
    4: {
        id: 4,
        name: 'Serves'
    },
    5: {
        id: 5,
        name: 'Receptions'
    },
    6: {
        id: 6,
        name: 'Errors'
    },
    7: {
        id: 7,
        name: 'Time Period'
    },
    8: {
        id: 8,
        name: 'Rotation'
    },
    9: {
        id: 9,
        name: 'Top Searches'
    }

};

IntelligenceWebClient.constant('FILTERSET_CATEGORIES', FILTERSET_CATEGORIES);

var FILTER_CATEGORY_TYPES_IDS = {
    1: 'STANDARD',
    2: 'PLAYER',
    3: 'QA'
};

IntelligenceWebClient.constant('FILTERSET_CATEGORY_TYPES_IDS', FILTER_CATEGORY_TYPES_IDS);

var FILTER_CATEGORY_TYPES = {
    STANDARD: {
        id: 1
    },
    PLAYER: {
        id: 2
    },
    QA: {
        id: 3
    }
};

IntelligenceWebClient.constant('FILTERSET_CATEGORY_TYPES', FILTER_CATEGORY_TYPES);
