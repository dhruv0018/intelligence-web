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
        //TODO change to non harcoded values

        $scope.mocks = {
            data: {
                games: [],
                gameId : '1',
                team: {},
                rosterId : '11'
            }
        };



        teams.get('11', function (team) {
            $scope.mocks.data.team = team;
        });



        games.getList({
            teamId: '11'
        }, function (games) {
            $scope.mocks.data.games = games;
        });
    }
]);

