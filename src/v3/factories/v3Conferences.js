const PAGE_SIZE = 1000;
const pkg = require('../../../package.json');
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3ConferencesFactory', [
    'config',
    '$injector',
    'v3BaseFactory',
    function(
        config,
        $injector,
        v3BaseFactory
    ) {

        const ConferencesFactory = {

            PAGE_SIZE,

            description: 'conferences'
        };

        angular.augment(ConferencesFactory, v3BaseFactory);

        return ConferencesFactory;
    }
]);
