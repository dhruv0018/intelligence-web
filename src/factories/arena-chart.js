const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

ArenaChartFactory.$inject = [
    '$injector',
    '$q',
    'BaseFactory'
];

function ArenaChartFactory(
    $injector,
    $q,
    BaseFactory
) {

    const ArenaChartFactoryDefinition = {

        description: 'arenachart',

        model: 'ArenaChartResource',

        storage: 'ArenaChartStorage',

    };

    angular.augment(arenaChartFactoryDefinition, BaseFactory);

    return ArenaChartFactoryDefinition;
}

IntelligenceWebClient.factory('ArenaChartFactory', ArenaChartFactory);
