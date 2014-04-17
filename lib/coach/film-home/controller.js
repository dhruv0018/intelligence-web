/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Coach.FilmHome');


FilmHome.service('Coach.FilmHome.GameFilters', function () {


    var filtersData = {
        filters: {
            'all': true,
            'others': {
                'film': false,
                'reels': false,
                'scouting': false,
                'scrimmage': false
            }
        },
        othersDisabled: true,
        disableOthers: function () {

            Object.keys(this.filters.others).forEach(function(filterName) {

                this.filters.others[filterName] = false;

            }, this);

            this.othersDisabled = true;
        },
        watchOthers: function () {

            this.othersDisabled = Object.keys(this.filters.others).every(function(filterName) {

                return !this.filters.others[filterName];

            }, this);

            this.filters.all = this.othersDisabled;
        }
    };

    return filtersData;
});


/**
 * User controller. Controls the view for adding and editing a single user.
 * @module FilmHome
 * @name FilmHome.controller
 * @type {controller}
 */
FilmHome.controller('Coach.FilmHome.controller', [
    '$rootScope', '$scope', '$state', 'SessionService', 'TeamsFactory', 'GamesFactory', 'Coach.FilmHome.Data', 'Coach.FilmHome.GameFilters',
    function controller($rootScope, $scope, $state, session, teams, games, data, filtersData) {

        data.then(function (data) {
            $scope.games = data.games;
            $scope.team = data.coachTeam;
            $scope.teams = data.teams;
            $scope.mockRoster = data.roster;
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

