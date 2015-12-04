var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

const STATE_NAMES = {

    'Games.RawFilm': {
        display: 'Raw',
        id: 'raw-film-cta'
    },

    'Games.Breakdown': {
        display: 'Breakdown',
        id: 'breakdown-cta'
    },

    'Games.DownAndDistance': {
        display: 'Down and Distance Report',
        id: 'down-and-distance-cta'
    },

    'Games.Info': {
        display: 'Game Info',
        id: 'game-info-cta'
    },

    'Games.Stats': {
        display: 'Stats',
        id: 'stats-cta'
    },

    'Games.Formations': {
        display: 'Formation Report',
        id: 'formation-report-cta'
    },

    'Games.ArenaChart': {
        display: 'Shot Chart',
        id: 'arena-chart-cta'
    },

    'Games.SelfEditor': {
        display: 'Self-Editor',
        id: 'self-editor-cta'
    }
};

IntelligenceWebClient.constant('STATE_NAMES', STATE_NAMES);

const STATES = {

    INDEXER_GAMES_ASSIGNED: 'IndexerGamesAssigned',
    INDEXER_GAMES: 'IndexerGames'

};

IntelligenceWebClient.constant('STATES', STATES);
