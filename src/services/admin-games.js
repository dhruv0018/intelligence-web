const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

AdminGamesService.$inject = [
    'GamesResolutionService'
];

function AdminGamesService (
    GamesResolutionService
) {

    const service = Object.create(GamesResolutionService);

    return service;
}

IntelligenceWebClient.service('AdminGamesService', AdminGamesService);
