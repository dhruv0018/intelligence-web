const PAGE_SIZE = 1000;
const pkg = require('../../../package.json');
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3BreakdownRatingsFactory', [
    'config',
    '$injector',
    'v3BaseFactory',
    function(
        config,
        $injector,
        v3BaseFactory
    ) {

        const BreakdownRatingsFactory = {

            PAGE_SIZE,

            model: 'v3BreakdownRatingResource',

            description: 'breakdown-ratings'
        };

        angular.augment(BreakdownRatingsFactory, v3BaseFactory);

        return BreakdownRatingsFactory;
    }
]);
