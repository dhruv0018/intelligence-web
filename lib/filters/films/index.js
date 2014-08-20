/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Films
 * @module Films
 */
var Film = angular.module('Film.Filter', []);

/**
 * Films filter.
 * @module Films
 * @name nameOfTheGame
 * @type {Filter}
 */
Film.filter('nameOfTheFilm', [
    'TeamsFactory',
    function(teams) {

        return function(films, query) {
            if (query.length === 0) {
                return films;
            }

            var filteredFilms = [];

            Object.keys(films).forEach(function(key) {
                var film = this[key];
                var team = teams.get(film.teamId);
                var opposingTeam = teams.get(film.opposingTeamId);

                if (team.name.toLowerCase().indexOf(query) >= 0 || opposingTeam.name.toLowerCase().indexOf(query) >= 0) {
                    filteredFilms.push(film);
                }
            }, films);


            return filteredFilms;
        };
    }
]);
