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
    '$rootScope', '$scope', '$state', 'SessionService', 'TeamsFactory', 'GamesFactory',
    function controller($rootScope, $scope, $state, session, teams, games) {
        $scope.games = [];
        $scope.teamId = session.currentUser.currentRole.teamId;
        $scope.rosterId = '11';

        $scope.filters = {
            'film': false,
            'reels': false,
            'scouting': false,
            'scrimmage': false,
            'all': false
        };

        $scope.$watch('filters', function (filters) {

            if (filters.film === true) {

                if (filters.all === true) {
                    filters.film = false;
                    filters.reels = false;
                    filters.scouting = false;
                    filters.scrimmage = false;
                }
            }

        }, true);


        $scope.search = function (filter) {
            //searches all games for a team if there is no other search parameter
            if (!filter.query || filter.query.length === 0) {
                games.getList({
                    teamId: $scope.teamId
                }, function (games) {
                    $scope.games = games;
                });
            } else {
                games.getList({
                    team: filter.query
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

