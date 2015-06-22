var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var STATE_NAMES = {

    'Games.RawFilm': {
        display: 'Raw'
    },

    'Games.Breakdown': {
        display: 'Breakdown'
    },

    'Games.DownAndDistance': {
        display: 'Down and Distance Report'
    },

    'Games.Info': {
        display: 'Game Info'
    },

    'Games.Stats': {
        display: 'Stats'
    },

    'Games.Formations': {
        display: 'Formation Report'
    },

    'Games.ArenaChart': {
        display: 'Shot Chart'
    }
};

IntelligenceWebClient.constant('STATE_NAMES', STATE_NAMES);
