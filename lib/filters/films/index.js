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
            var modifiedQuery = query.toLowerCase();

            angular.forEach(films, function(film) {
                if (film.gameType) {
                    var team = teams.get(film.teamId);
                    var opposingTeam = teams.get(film.opposingTeamId);

                    if (team.name.toLowerCase().indexOf(modifiedQuery) >= 0 || opposingTeam.name.toLowerCase().indexOf(modifiedQuery) >= 0) {
                        filteredFilms.push(film);
                    }
                } else {
                    if (film.name && film.name.toLowerCase().indexOf(modifiedQuery) >= 0) {
                        filteredFilms.push(film);
                    }
                }
            });


            return filteredFilms;
        };
    }
]);
