var PAGE_SIZE = 100;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('LeaguesFactory', [
    'BaseFactory',
    function(BaseFactory) {

        var LeaguesFactory = {

            description: 'leagues',

            model: 'LeaguesResource',

            storage: 'LeaguesStorage',

            getLeaguesBySportId: function(sportId) {
                let allLeagues = this.getList();
                return allLeagues.filter(league => {
                    return league.sportId === sportId;
                });
            }
        };

        angular.augment(LeaguesFactory, BaseFactory);

        return LeaguesFactory;
    }
]);
