const PAGE_SIZE = 100;

const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

const IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.factory('LeaguesFactory', [
    'BaseFactory',
    'config',
    function(
        BaseFactory,
        config
    ) {

        const LeaguesFactory = {

            description: 'leagues',

            model: 'LeaguesResource',

            storage: 'LeaguesStorage',

            getLeaguesBySportId: function(sportId) {
                let allLeagues = this.getList();
                return allLeagues.filter(league => league.sportId === sportId);
            },

            getCurrentSeason: function() {
                let currentDate = moment(Date.now());
                return this.seasons.find(season => {
                    if (currentDate.isAfter(moment(season.startDate)) && currentDate.isBefore(moment(season.endDate))) {
                        return season;
                    }
                });
            },

            belongsToYardFormatWhitelist(league = this) {

                return config.yardFormatLeagueIdsWhitelist.indexOf(league.id) >= 0;
            }
        };

        angular.augment(LeaguesFactory, BaseFactory);

        return LeaguesFactory;
    }
]);
