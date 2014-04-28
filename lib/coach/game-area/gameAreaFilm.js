/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Film page module.
 * @module GameArea
 */
var GameAreaFilm = angular.module('game-area-film', [
    'ui.router',
    'ui.bootstrap',
    'Indexing'
]);

GameAreaFilm.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaFilm.html', require('./gameAreaFilm.html'));
    }
]);

GameAreaFilm.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-film',
            url: '/film',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaFilm.html',
                    controller: 'GameAreaFilmController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaFilm.controller('GameAreaFilmController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'PlaysFactory', 'FiltersetsFactory', 'GAME_STATUS_IDS', 'FILTERSET_CATEGORIES', 'Coach.Data',
    function controller($scope, $state, $stateParams, games, plays, filtersets, GAME_STATUS_IDS, FILTERSET_CATEGORIES, data) {
        $scope.filtersetCategories = angular.copy(FILTERSET_CATEGORIES);

        //TODO remove hardcoded exclusion list
        $scope.exclusion = [1, 2, 3, 41, 15, 31, 27];

        //TODO fix hardcoded filter set id

        filtersets.get('1', function(filterset) {
            angular.forEach(filterset.filters, function(filter) {
                $scope.filtersetCategories[filter.filterCategoryId].subFilters = $scope.filtersetCategories[filter.filterCategoryId].subFilters || [];

                var excluded = $scope.exclusion.some(function(excludedFilterId) {
                    return filter.id === excludedFilterId;
                });
                console.log(excluded);

                if (!excluded) {
                    $scope.filtersetCategories[filter.filterCategoryId].subFilters.push(filter);
                }

            });
            console.log($scope.filtersetCategories);
        });


        $scope.gameId = $state.params.id;
        $scope.filterId = '';
        $scope.filterCategory = 1;
        $scope.activeFilters = [];

        $scope.$watch('filterId', function(filterId) {
            if(filterId > 0) {
                plays.filterPlays({
                    filterId: $scope.filterId
                }, $scope.resources, function(plays) {
                    $scope.plays = plays[$scope.gameId];
                });
            }
        });

        $scope.$watch('activeFilters', function(activeFilters) {
            console.log(activeFilters);
            console.log($scope.totalPlays);

            if(activeFilters.length === 0){
                $scope.plays = $scope.totalPlays;
            }

        }, true);

        $scope.setFilter = function(filter) {
            $scope.filterId = filter.id;

            var isPresent = $scope.activeFilters.some(function(filter) {
                return filter.id === $scope.filterId;
            });

            if (!isPresent) {
                $scope.activeFilters.push(filter);
            }

        };

        $scope.setFilterCategory = function(filterCategory) {
            $scope.filterCategory = filterCategory;
        };

        $scope.removeFilter = function(index) {
            $scope.activeFilters.splice(index, 1);
        };


        data.then(function(data){
            $scope.game = data.game;
            $scope.team = data.coachTeam;
            $scope.opposingTeam = data.teams[$scope.game.opposingTeamId];
            $scope.league = data.league;
            try {
                $scope.gameStatus = GAME_STATUS_IDS[$scope.game.status];
                $scope.sources = $scope.game.getVideoSources();
                plays.getList($scope.gameId, function (plays) {
                    data.plays = plays;
                    $scope.totalPlays = plays;
                    $scope.plays = plays;

                    console.log(data);



                    $scope.resources = {
                        game: $scope.game,
                        plays: $scope.plays
                    };
                });


            } catch (e) {
                console.log('corrupted game');
                console.log(e);
            }
        });
    }
]);
