/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Sport
 * @module Sport
 */
var Sport = angular.module('Sport.Filter', []);

/**
 * Sport filter.
 * @module Sport
 * @name sport
 * @type {Filter}
 */
Sport.filter('sport', [
    'SportsFactory', 'LeaguesFactory',
    function(sports, leagues) {

        return function(resources, filter) {

            var filtered = [];

            if (!resources || !filter) return filtered;

            /* Negate filters starting with an exclamation mark character. */
            var negate = angular.isString(filter) && filter.charAt(0) === '!';

            /* Remove the negation prefix if present. */
            if (negate) {

                filter = filter.slice(1);
            }

            /* Ensure filter is a number. */
            filter = Number(filter);

            angular.forEach(resources, function(resource) {

                if (!resource) return filtered;

                var team;
                var league;

                /* If the resource is a team. */
                if (resource.description === 'teams') {

                    /* Find the league. */
                    team = resource;
                    var leagueId = team.leagueId;
                    league = leagues.get(leagueId);
                }

                /* If the resource is a league. */
                else if (resource.description === 'leagues') {

                    league = resource;
                }

                if (!league) return filtered;

                /* Find the sport. */
                var sportId = league.sportId;
                var sport = sports.get(sportId);

                if (!sport) return filtered;

                if (angular.isNumber(filter)) {

                    /* Compare sport ID to the filter. */
                    if (negate ? sport.id != filter : sport.id == filter) {

                        /* Include the team in the filtered list. */
                        filtered.push(resource);
                    }
                }
            });

            return filtered;
        };
    }
]);

export default Sport;
