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
        $scope.gameId = $state.params.id;
        $scope.filterId = null;
        $scope.teamId = null;
        $scope.filterCategory = 1;
        $scope.activeFilters = [];

        $scope.activeFilters.contains = function(id){
            return this.some(function(filter){
                return id === filter.id;
            });
        };

        $scope.$watch('filterId', function(filterId) {
            $scope.resources = {
                game: $scope.game,
                plays: $scope.plays,
                teamId: $scope.teamId
            };

            console.log($scope.resources);

            if(filterId > 0) {
                plays.filterPlays({
                    filterId: $scope.filterId
                }, $scope.resources, function(plays) {
                    $scope.plays = plays[$scope.gameId];
                });
            }
        });

        $scope.$watch('activeFilters', function(activeFilters) {
            if (activeFilters.length === 0) {
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

        $scope.setTeam = function(teamId) {
            console.log(teamId);
            $scope.teamId = teamId;
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
            $scope.teamId = $scope.team.id;
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
                    //TODO remove hardcoded exclusion list
                    $scope.exclusion = [1, 2, 3, 41, 15, 31, 27];

                    //TODO fix hardcoded filter set id
                    filtersets.get('1', function(filterset) {
                        $scope.playerFilter = {};
                        angular.forEach(filterset.filters, function(filter) {
                            $scope.filtersetCategories[filter.filterCategoryId].subFilters = $scope.filtersetCategories[filter.filterCategoryId].subFilters || [];

                            //TODO figure out a better way to deal with players at a later date
                            if (filter.name === 'Player') {
                                $scope.playerFilter = filter;
                            }

                            var excluded = $scope.exclusion.some(function(excludedFilterId) {
                                return filter.id === excludedFilterId;
                            });

                            if (!excluded) {
                                $scope.filtersetCategories[filter.filterCategoryId].subFilters.push(filter);
                            }

                        });

                        angular.forEach(data.roster, function(player) {
                            var playerFilter = {
                                id: $scope.playerFilter.id,
                                playerId: player.id,
                                name: player.firstName[0] + '. ' + player.lastName,
                                filterCategoryId: $scope.playerFilter.filterCategoryId
                            };
                            $scope.filtersetCategories[$scope.playerFilter.filterCategoryId].subFilters.push(playerFilter);
                        });

                    });
                });


            } catch (e) {
                console.log('corrupted game');
                console.log(e);
            }
        });
    }
]);
