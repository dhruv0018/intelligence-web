/*globals require*/
/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Film
 * @module Film
 */
var Film = angular.module('film', [
    'ui.router',
    'ui.bootstrap',
    'thumbnail'
]);

/* Cache the template file */
Film.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('film.html', require('./template.html'));
    }
]);

/**
 * Film directive.
 * @module Role
 * @name Role
 * @type {Directive}
 */
Film.directive('krossoverFilm', [
    'TeamsFactory',
    function directive(teams) {

        var film = {

            restrict: TO += ELEMENTS,
            templateUrl: 'film.html',
            scope: {
                game: '='
            },
            replace: true,
            link: function (scope, element, attrs) {
                scope.$watch('game', function (game) {
                    if (scope.game && scope.game.id) {

                        teams.get(scope.game.teamId, function (team) {
                            scope.team = team;
                        });

                        teams.get(scope.game.opposingTeamId, function (team) {
                            scope.opposingTeam = team;
                        });
                        
                    }
                });
            }
        };

        return film;
    }
]);
