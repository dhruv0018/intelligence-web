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
 * @name nameOfTheFilm
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
                    var team = film.teamId ? teams.get(film.teamId) : null;
                    var opposingTeam = film.opposingTeamId ? teams.get(film.opposingTeamId) : null;

                    if (team && team.name.toLowerCase().indexOf(modifiedQuery) >= 0 || opposingTeam && opposingTeam.name.toLowerCase().indexOf(modifiedQuery) >= 0) {
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

                return secondFilmDate - firstFilmDate;
            });

            return filteredFilms;
        };
    }
]);

Film.filter('sortByRemainingTime', [
    'TeamsFactory',
    function(teams) {

        return function(games) {

            var now = moment.utc();

            var filteredGames = games.slice();

            filteredGames.sort(function(firstGame, secondGame) {

                return secondGame.timeRemaining(now) - firstGame.timeRemaining(now);
            });

            return filteredGames;
        };
    }
]);
