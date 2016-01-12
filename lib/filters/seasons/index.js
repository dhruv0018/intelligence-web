/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

/**
 * Games
 * @module Games
 */
var Seasons = angular.module('Seasons.Filter', []);

/**
 * Games filter.
 * @module Games
 * @name gameIsDeleted
 * @type {Filter}
 */

formattedSeasons.$inject = [
    'SessionService',
    'TeamsFactory',
    'SPORTS'
];

function formattedSeasons (
    session,
    teams,
    SPORTS
) {
    return (season) => {

        const team = teams.get(session.getCurrentTeamId());

        // Only basketball should span multiple years.
        const sport = team.getSport();
        const isBasketball = sport.id === SPORTS.BASKETBALL.id;

        let startDate = moment(season.startDate).year();
        let endDate = moment(season.endDate).format('YY');

        return (startDate === endDate || !isBasketball) ? startDate : startDate + '-' + endDate;
    };
}

Seasons.filter('formattedSeasons', formattedSeasons);
