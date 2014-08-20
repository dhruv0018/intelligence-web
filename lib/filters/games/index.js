/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Games
 * @module Games
 */
var Games = angular.module('Games.Filters', []);

/**
 * Games filter.
 * @module Games
 * @name nameOfTheGame
 * @type {Filter}
 */
Games.filter('nameOfTheGame', [
    'TeamsFactory',
    function(teams) {

        return function(games, query) {
            if (query.length === 0) {
                return games;
            }

            var filteredGames = [];

            Object.keys(games).forEach(function(key) {
                var game = this[key];
                var team = teams.get(game.teamId);
                var opposingTeam = teams.get(game.opposingTeamId);

                if (team.name.toLowerCase().indexOf(query) >= 0 || opposingTeam.name.toLowerCase().indexOf(query) >= 0) {
                    filteredGames.push(game);
                }
            }, games);


            return filteredGames;
        };
    }
]);
