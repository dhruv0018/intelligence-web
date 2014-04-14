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
            'all': false,
            'others': {
                'film': false,
                'reels': false,
                'scouting': false,
                'scrimmage': false
            }
        };

        $scope.$watch('filters.all', function (all) {
            if (all === true) {
                for (var filter in $scope.filters.others) {
                    if($scope.filters.others.hasOwnProperty(filter)) {
                        $scope.filters.others[filter] = false;
                    }
                }
            }
        });

        $scope.$watch('filters.others', function (others) {
            for (var filter in others) {
                if(others.hasOwnProperty(filter) && others[filter] === true) {
                    $scope.filters.all = false;
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

