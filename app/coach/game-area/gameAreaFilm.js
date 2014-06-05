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

        $scope.contains = function(array, id) {
            return array.some(function(filter) {
                return id === filter.id;
            });
        };

        $scope.clearFilters  = function() {
            $scope.activeFilters = [];
        };

        $scope.$watch('activeFilters', function(activeFilters) {
            if (activeFilters.length > 0) {
                var recombining = false;

                $scope.resources = {
                    game: $scope.game,
                    plays: $scope.totalPlays,
                    teamId: $scope.teamId
                };

                var lastFilter = activeFilters[activeFilters.length - 1];

                if (lastFilter.id === 1 && activeFilters.length > 1) {
                    var previousFilter = activeFilters[activeFilters.length - 2];

                    if (previousFilter.associatePlayer) {
                        recombining = true;
                        var uncombinedFilters = activeFilters.slice(-2);
                        var combinedFilter = {
                            id: uncombinedFilters[uncombinedFilters.length - 2].id,
                            teamId: uncombinedFilters[uncombinedFilters.length - 1].teamId,
                            playerId: uncombinedFilters[uncombinedFilters.length - 1].playerId,
                            name: uncombinedFilters[uncombinedFilters.length - 2].name + ' by ' + uncombinedFilters[uncombinedFilters.length - 1].name,
                            filterCategoryId: uncombinedFilters[uncombinedFilters.length - 1].filterCategoryId,
                            customFilter: true
                        };
                        activeFilters.splice(-2, 2, combinedFilter);
                    }

                }

                if (!recombining) {

                    $scope.remainingFilters = [];

                    //TODO refactor this when we have time
                    angular.forEach($scope.activeFilters, function(filter) {
                        $scope.remainingFilters.push(filter);
                    });

                    $scope.plays = $scope.recursiveFilter($scope.remainingFilters);
                }

            }

            if (activeFilters.length === 0) {
                $scope.plays = $scope.totalPlays;
            }

        }, true);

        $scope.recursiveFilter = function(activeFilters) {
            if (activeFilters.length === 0 || $scope.resources.plays.length === 0) {
                return $scope.plays;
            }

            var currentFilter = activeFilters.shift();

            if (currentFilter.playerId) {
                $scope.resources.playerId = currentFilter.playerId;
            }


            plays.filterPlays({
                filterId: currentFilter.id
            }, $scope.resources, function(plays) {

                $scope.plays = plays[$scope.game.id];

                $scope.resources = {
                    game: $scope.game,
                    plays: $scope.plays,
                    teamId: $scope.teamId
                };

                return $scope.recursiveFilter(activeFilters);
            });

        };


        $scope.setFilter = function(filter) {
            $scope.filterId = filter.id;

            var isPresent = false;

            if (!filter.customFilter) {
                isPresent = $scope.activeFilters.some(function(filter) {
                    return filter.id === $scope.filterId;
                });
            }

            if (!isPresent) {
                $scope.activeFilters.push(filter);
            }

        };

        $scope.setTeam = function(teamId) {
            $scope.teamId = teamId;
        };

        $scope.setFilterCategory = function(filterCategory) {
            $scope.filterCategory = filterCategory;
        };

        $scope.removeFilter = function(index) {
            $scope.activeFilters.splice(index, 1);
        };


        data.then(function(data) {
            $scope.game = data.game;
            $scope.team = data.coachTeam;
            $scope.teamId = $scope.team.id;
            $scope.opposingTeam = data.teams[$scope.game.opposingTeamId];
            $scope.league = data.league;
            $scope.gameStatus = GAME_STATUS_IDS[$scope.game.status];
            $scope.sources = $scope.game.getVideoSources();

            if ($scope.gameStatus === 'INDEXED') {
                try {
                    plays.getList($scope.gameId, function(plays) {
                        data.plays = plays;
                        $scope.totalPlays = plays;
                        $scope.plays = plays;

                        //TODO remove hardcoded exclusion list
                        $scope.exclusion = [1];

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

                            angular.forEach(data.opposingTeamGameRoster.players, function(player) {

                                var playerFilter = {
                                    id: $scope.playerFilter.id,
                                    teamId: data.opposingTeamGameRoster.teamId,
                                    playerId: player.id,
                                    name: player.firstName[0] + '. ' + player.lastName,
                                    filterCategoryId: $scope.playerFilter.filterCategoryId,
                                    customFilter: true
                                };
                                $scope.filtersetCategories[$scope.playerFilter.filterCategoryId].subFilters.push(playerFilter);
                            });

                            angular.forEach(data.teamGameRoster.players, function(player) {

                                var playerFilter = {
                                    id: $scope.playerFilter.id,
                                    teamId: data.teamGameRoster.teamId,
                                    playerId: player.id,
                                    name: player.firstName[0] + '. ' + player.lastName,
                                    filterCategoryId: $scope.playerFilter.filterCategoryId,
                                    customFilter: true
                                };
                                $scope.filtersetCategories[$scope.playerFilter.filterCategoryId].subFilters.push(playerFilter);
                            });

                        });

                    });


                } catch (e) {
                    console.log('corrupted game');
                    console.log(e);
                }
            }

        });
    }
]);
