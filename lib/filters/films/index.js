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

Film.filter('sortByDate', [
    'TeamsFactory',
    function(teams) {

        return function(films, query) {
            var filteredFilms = films.slice();

            filteredFilms.sort(function(firstFilm, secondFilm) {
                var firstFilmDateString = (firstFilm.gameType) ? firstFilm.datePlayed : firstFilm.updatedAt;
                var secondFilmDateString = (secondFilm.gameType) ? secondFilm.datePlayed : secondFilm.updatedAt;
                var firstFilmDate = new Date(firstFilmDateString);
                var secondFilmDate = new Date(secondFilmDateString);

                if (firstFilmDate > secondFilmDate) {
                    return -1;
                } else if (firstFilmDate < secondFilmDate) {
                    return 1;
                } else {
                    return 0;
                }
            });

            return filteredFilms;
        };
    }
]);
