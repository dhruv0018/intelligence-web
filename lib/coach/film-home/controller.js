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
    '$rootScope', '$scope', '$state', 'SessionService', 'TeamsFactory', 'GamesFactory', 'Coach.GameData', 'Coach.FilmHome.GameFilters',
    function controller($rootScope, $scope, $state, session, teams, games, data, filtersData) {

        data.then(function (data) {
            $scope.games = data.games;

            //TODO this is Mock data -- remove later
//            var tmpGame = angular.copy($scope.games[5]);
//            tmpGame.filterType = 'scrimmage';
//            $scope.games.push(tmpGame);
//            tmpGame = angular.copy($scope.games[5]);
//            tmpGame.filterType = 'scouting';
//            $scope.games.push(tmpGame);
            //END MOCK DATA

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
                }, function(games) {
                    $scope.games = games;
                }, function() {
                    //setup for no search results
                    $scope.games = [];
                });
            }
        };

    }
]);

