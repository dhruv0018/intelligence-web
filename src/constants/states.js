var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var STATE_NAMES = {

    'Games.RawFilm': {
        display: 'Raw Film'
    },

    'Games.Breakdown': {
        display: 'Film Breakdown'
    },

    'Games.DownAndDistance': {
        display: 'Down and Distance Report'
    },

    'Games.Info': {
        display: 'Game Information'
    },

    'Games.Stats': {
        display: 'Statistics'
    },

    'Games.Formations': {
        display: 'Formation Report'
    },

    'Games.ShotChart': {
        display: 'Shot Chart'
    }
};

IntelligenceWebClient.constant('STATE_NAMES', STATE_NAMES);





