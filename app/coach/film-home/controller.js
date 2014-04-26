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
    '$rootScope', '$scope', '$state', 'GamesFactory', 'Coach.Data', 'Coach.FilmHome.GameFilters',
    function controller($rootScope, $scope, $state, games, data, filtersData) {

        data.then(function (data) {
            $scope.games = data.games;
            $scope.team = data.coachTeam;
            $scope.teams = data.teams;
            $scope.mockRoster = data.roster;
            $scope.rosterId = data.rosterId.id;
        });

        $scope.filters = filtersData.filters;

        $scope.$watch('filters.all', function (all) {

            if(all === true) {
                filtersData.disableOthers();
            }

            else if(filtersData.othersDisabled === true) {
                $scope.filters.all = true;
            }
        });

        $scope.$watchCollection('filters.others', function (others) {
            filtersData.watchOthers();
        });



        $scope.search = function(query) {
            //searches all games for a team if there is no other search parameter
            if (!query || query.length === 0) {

                games.getList({teamId: data.teamId}, function(gamesList) {
                    $scope.games = gamesList;
                });

            } else {
                games.getList({
                    team: query
                }, function(gamesList) {
                    $scope.games = gamesList;
                }, function() {
                    //setup for no search results
                    $scope.games = [];
                });
            }
        };

    }
]);
