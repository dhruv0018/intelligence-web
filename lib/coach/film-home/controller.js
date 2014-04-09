/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Coach.FilmHome');

/**
 * User controller. Controls the view for adding and editing a single user.
 * @module FilmHome
 * @name FilmHome.controller
 * @type {controller}
 */
FilmHome.controller('Coach.FilmHome.controller', [
    '$rootScope', '$scope', '$state', 'TeamsFactory', 'GamesFactory',
    function controller($rootScope, $scope, $state, teams, games) {
        $scope.mocks = {
            data: {
                gameId : '16',
                team: {},
                game: {}
            }
        };

        games.get($scope.mocks.data.gameId, function (game) {
            $scope.mocks.data.game = game;
            $scope.mocks.data.rosterId = '157';

            teams.get($scope.mocks.data.game.teamId, function (team) {
                $scope.mocks.data.team = team;
            });

        });
    }
]);

