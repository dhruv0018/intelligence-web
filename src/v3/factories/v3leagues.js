const PAGE_SIZE = 1000;
const pkg = require('../../../package.json');
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('v3LeagueFactory', [
    'config',
    '$injector',
    'v3BaseFactory',
    function(
        config,
        $injector,
        v3BaseFactory
    ) {

        const LeagueFactory = {

            PAGE_SIZE,

            description: 'league',

            extend: function(league){
                let self = this;

                angular.augment(league, self);

                return league;
            },

            unextend: function(example){
                let self = this;

                example = example || self;

                let copy = v3BaseFactory.unextend(example);

                return copy;
            }
        };

        angular.augment(LeagueFactory, v3BaseFactory);

        return LeagueFactory;
    }
]);
