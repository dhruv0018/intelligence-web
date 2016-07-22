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
                let currentDate = moment();
                return this.seasons.find(season => {
                    if (currentDate.isAfter(moment(season.startDate)) && currentDate.isBefore(moment(season.endDate))) {
                        return season;
                    }
                });
            },

            getMostRecentSeason: function() {
                let seasons = this.seasons.sort((a, b) => moment(b.startDate).diff(a.startDate));
                return seasons[0];
            },

            getSeasonForWSC: function() {
                /* For WSC, if the latest season is less than halfway through, get the previous one */
                let currentDate = moment().valueOf();
                let seasons = this.seasons.sort((a, b) => moment(b.startDate).diff(a.startDate));
                return seasons.find(season => {
                    let seasonStartDate = moment(season.startDate).valueOf();
                    let seasonEndDate = moment(season.endDate).valueOf();
                    let dateDifference = (moment(season.endDate).valueOf() - moment(season.startDate).valueOf()) / 2;
                    let seasonMidPoint = moment(season.endDate).valueOf() - dateDifference;
                    if (currentDate > seasonMidPoint) {
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
