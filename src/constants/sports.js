var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var SPORTS = {

    BASKETBALL: {
        id: 1,
        name: 'Basketball'
    },

    FOOTBALL: {
        id: 2,
        name: 'Football'
    },

    LACROSSE: {
        id: 3,
        name: 'Lacrosse'
    },

    VOLLEYBALL: {
        id: 4,
        name: 'Volleyball'
    }
};

IntelligenceWebClient.constant('SPORTS', SPORTS);
