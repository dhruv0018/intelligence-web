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
    'SessionService'
];

function formattedSeasons (
    session
) {
    return (season) => {

        let startDate = moment(season.startDate).year();
        let endDate = moment(season.endDate).year();

        return (startDate === endDate) ? startDate : startDate + ' - ' + endDate;
    };
}

Seasons.filter('formattedSeasons', formattedSeasons);
