const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

IndexerGamesService.$inject = [
    'GamesResolutionService'
];

function IndexerGamesService (
    GamesResolutionService
) {

    const service = Object.create(GamesResolutionService);

    return service;
}

IntelligenceWebClient.service('IndexerGamesService', IndexerGamesService);
