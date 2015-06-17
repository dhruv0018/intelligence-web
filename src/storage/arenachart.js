const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

ArenaChartStorageFactory.$inject = [
    'ArenaChartFactory',
    'BaseStorage'
];

function ArenaChartStorageFactory(
    arenachart,
    BaseStorage
) {

    const ArenaChartStorage = Object.create(BaseStorage);

    ArenaChartStorage.factory = arenachart;
    ArenaChartStorage.description = arenachart.description;

    return ArenaChartStorage;
}

IntelligenceWebClient.factory('ArenaChartStorage', ArenaChartStorageFactory);
