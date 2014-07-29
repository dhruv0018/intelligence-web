/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game Area Film Breakdown page module.
 * @module GameArea
 */
var GameAreaFilmBreakdown = angular.module('game-area-film-breakdown', [
    'ui.router',
    'ui.bootstrap',
    'Indexing'
]);

GameAreaFilmBreakdown.run([
    '$templateCache',
    function run($templateCache) {
        $templateCache.put('coach/game-area/gameAreaFilmBreakdown.html', require('./gameAreaFilmBreakdown.html'));
    }
]);

GameAreaFilmBreakdown.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'ga-film-breakdown',
            url: '/film-breakdown',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/gameAreaFilmBreakdown.html',
                    controller: 'GameAreaFilmBreakdownController'
                }
            }
        };

        $stateProvider.state(gameArea);

    }
]);

GameAreaFilmBreakdown.controller('GameAreaFilmBreakdownController', [
    '$scope', '$state', '$stateParams', 'GamesFactory', 'PlaysFactory', 'FiltersetsFactory', 'Coach.Data',
    function controller($scope, $state, $stateParams, games, plays, filtersets, data) {
        $scope.gameId = $state.params.id;
        $scope.data = data;
        $scope.teamId = data.game.teamId;
        $scope.leagues = data.leagues.getCollection();
        $scope.league = $scope.leagues[$scope.team.leagueId];
        $scope.expandAll = false;
        $scope.filterCategory = data.filterset.categories[0].id;
        $scope.activeFilters = [];
        $scope.filterMenu = {
            isOpened: false
        };

        $scope.contains = function(array, id, playerId) {
            return array.some(function(filter) {
                if (!filter.customFilter) {
                    return id === filter.id;
                } else {
                    return playerId === filter.playerId;
                }
            });
        };

        $scope.clearFilters  = function() {
            $scope.activeFilters = [];
        };

        $scope.$watch('activeFilters', function(activeFilters) {
            if (activeFilters.length === 0) {
                $scope.plays = $scope.totalPlays;
            }

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
            }, $scope.resources, function(filteredPlays) {

                filteredPlays[$scope.game.id].forEach(function(play) {

                    play = plays.extend(play);
                });

                $scope.plays = filteredPlays[$scope.game.id];
                $scope.resources = {
                    game: $scope.game,
                    plays: $scope.plays,
                    teamId: $scope.teamId
                };


                return $scope.recursiveFilter(activeFilters);
            });

        };


        $scope.setFilter = function(filter) {
            var isPresent = $scope.contains($scope.activeFilters, filter.id, filter.playerId);

            if (!isPresent) {
                $scope.activeFilters.push(filter);
                $scope.filterMenu.isOpened = false;
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

    }
]);
