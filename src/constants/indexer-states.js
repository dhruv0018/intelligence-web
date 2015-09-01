var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

const INDEXER_STATES = {

    INDEXER_GAMES_ASSIGNED: 'IndexerGamesAssigned',
    INDEXER_GAMES: 'IndexerGames'

};

IntelligenceWebClient.constant('INDEXER_STATES', INDEXER_STATES);
