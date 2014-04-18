/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * FilmHome page module.
 * @module FilmHome
 */
var FilmHome = angular.module('Coach.FilmHome');


FilmHome.service('Coach.FilmHome.GameFilters', ['GAME_TYPES', function (otherFiltersConfiguration) {
//    'regular': false,
//    'reels': false,
//    'scouting': false,
//    'scrimmage': false

    var filtersData = {
        filters: {
            'all': true,
            'others': {}
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
        },
        listEnabled: function () {

            var enabledFilters = Object.keys(this.filters.others).filter(function(filterName) {
                return this.filters.others[filterName] === true;
            }, this);

            return enabledFilters;
        }
    };

    angular.forEach(otherFiltersConfiguration, function (filter) {
        console.log('running');
        this.filters.others[filter.filter] = false;
    }, filtersData);

    console.log(filtersData);

    return filtersData;
}]);

FilmHome.filter('testfilter', ['Coach.FilmHome.GameFilters', function (filters) {

    return function(games, options) {
        if (options.all === true) {
            console.log('returning everything');
            return games;
        }

        var filteredCollection = [];
        console.log(filters.listEnabled());
        console.log('returning something narrower');

        angular.forEach(games, function(game) {
            angular.forEach(filters.listEnabled(), function(filter) {
                if (game.filterType === filter) {
                    filteredCollection.push(game);
                }
            });
        });

        return filteredCollection;
    };

}]);

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

            var tmpGame = angular.copy($scope.games[5]);
            tmpGame.filterType = 'scrimmage';

            $scope.games.push(tmpGame);

            $scope.team = data.coachTeam;
            $scope.teams = data.teams;
            $scope.mockRoster = data.roster;
            $scope.rosterId = data.rosterId.id;
            console.log(data);
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

