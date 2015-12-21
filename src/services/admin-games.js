const pkg = require('../../package.json');
const angular = window.angular;
const IntelligenceWebClient = angular.module(pkg.name);

AdminGamesService.$inject = [
    'QueueGamesService'
];

function AdminGamesService (
    QueueGamesService
) {

    const service = Object.create(QueueGamesService);

    return service;
}

IntelligenceWebClient.service('AdminGamesService', AdminGamesService);
