const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

IndexerGamesService.$inject = [
    'QueueGamesService'
];

function IndexerGamesService (
    QueueGamesService
) {

    const service = Object.create(QueueGamesService);

    return service;
}

IntelligenceWebClient.service('IndexerGamesService', IndexerGamesService);
