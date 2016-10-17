/* Fetch angular from the browser scope */
const angular = window.angular;

/**
 * Games
 * @module Games
 */
const Seasons = angular.module('Seasons.Filter', []);

/**
 * Games filter.
 * @module Games
 * @name gameIsDeleted
 * @type {Filter}
 */

formattedSeasons.$inject = [];

function formattedSeasons () {
    return (season) => {

        let startDate = new Date(season.startDate).getUTCFullYear();
        let endDate = new Date(season.endDate).getUTCFullYear();
        let shortEndDate = endDate.toString().substr(2,2);

        return (startDate === endDate) ? startDate : startDate + '-' + shortEndDate;
    };
}

Seasons.filter('formattedSeasons', formattedSeasons);

export default Seasons;
