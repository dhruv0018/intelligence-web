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
        $scope.searchQuery = '';
        $scope.games = [];
        $scope.teamId = '11';
        $scope.rosterId = '11';

        $scope.search = function () {
            //searches all games for a team if there is no other search parameter

                if ($scope.searchQuery.length === 0) {

                    games.getList({
                        teamId: $scope.teamId
                    }, function (games) {
                        $scope.games = games;
                    });

                } else {

                    games.getList({
                        team: $scope.searchQuery
                    }, function (games) {
                        $scope.games = games;
                    });

                }

        };


        games.getList({
            teamId: $scope.teamId
        }, function (games) {
            $scope.games = games;
        });

        teams.get($scope.teamId, function (team) {
            $scope.team = team;
        });



    }
]);

