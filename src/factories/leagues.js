var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('LeaguesFactory', [
    'BaseFactory',
    'config',
    function(
        BaseFactory,
        config
    ) {

        var LeaguesFactory = {

            description: 'leagues',

            model: 'LeaguesResource',

            storage: 'LeaguesStorage',

            getLeaguesBySportId: function(sportId) {
                let allLeagues = this.getList();
                return allLeagues.filter(league => league.sportId === sportId);
            },

            belongsToYardFormatWhitelist(league = this) {

                return config.yardFormatLeagueIdsWhitelist.indexOf(league.id) >= 0;
            }
        };

        angular.augment(LeaguesFactory, BaseFactory);

        return LeaguesFactory;
    }
]);
