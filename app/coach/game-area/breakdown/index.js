/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Coach game area film breakdown page module.
 * @module Breakdown
 */
var Breakdown = angular.module('Coach.GameArea.Breakdown', [
    'ui.router',
    'ui.bootstrap'
]);

Breakdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/game-area/breakdown/template.html', require('./template.html'));
    }
]);

Breakdown.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var gameArea = {
            name: 'Coach.GameArea.Breakdown',
            url: '/film-breakdown',
            parent: 'Coach.GameArea',
            views: {
                'content@Coach.GameArea': {
                    templateUrl: 'coach/game-area/breakdown/template.html',
                    controller: 'Coach.GameArea.Breakdown.controller'
                }
            },
            resolve: {
                'Coach.Data': [
                    '$q', '$stateParams', 'FiltersetsFactory', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'Coach.Data.Dependencies',
                    function($q, $stateParams, filtersets, leagues, teams, games, players, plays, data) {

                        return $q.all(data).then(function(data) {

                            var gameId = $stateParams.id;

                            /* TODO: Maybe not do this. */
                            var game = games.get(gameId);
                            data.game = game;

                            /* TODO: Or this. */
                            var team = teams.get(game.teamId);
                            var league = leagues.get(team.leagueId);
                            data.league = league;

                            /* TODO: Refactor this. */
                            data.gamePlayerLists = {};

                            var teamPlayersFilter = { rosterId: game.rosters[game.teamId].id };
                            var teamPlayerList = players.load(teamPlayersFilter).then(function() {

                                var teamPlayers = players.getList(teamPlayersFilter);
                                data.teamPlayers = teamPlayers;
                                data.gamePlayerLists[game.teamId] = teamPlayers;
                            });

                            var opposingTeamPlayersFilter = { rosterId: game.rosters[game.opposingTeamId].id };
                            var opposingTeamPlayerList = players.load(opposingTeamPlayersFilter).then(function() {

                                var opposingTeamPlayers = players.getList(opposingTeamPlayersFilter);
                                data.opposingTeamPlayers = opposingTeamPlayers;
                                data.gamePlayerLists[game.opposingTeamId] = opposingTeamPlayers;
                            });

                            var playsFilter = { gameId: game.id };

                            var playsList = plays.load(playsFilter).then(function() {

                                data.plays = plays.getList(playsList);
                            });

                            return $q.all([teamPlayerList, opposingTeamPlayerList, playsList]).then(function(promisedData) {
                                //Filtersets
                                if (data.game.isDelivered()) {
                                    var exclusion = [];
                                    data.filterset = filtersets.get(data.league.filterSetId);
                                    if (data.filterset) {
                                        data.filtersetCategories = {};
                                        angular.forEach(data.filterset.categories, function(filterCategory) {
                                            //TODO deal with player stuff later
                                            data.filtersetCategories[filterCategory.id] = filterCategory;
                                        });

                                        var playerFilterTemplate = {};

                                        angular.forEach(data.filterset.filters, function(filter) {
                                            data.filtersetCategories[filter.filterCategoryId].subFilters = data.filtersetCategories[filter.filterCategoryId].subFilters || [];

                                            //TODO figure out a better way to deal with players at a later date
                                            if (filter.name === 'Player') {
                                                playerFilterTemplate = filter;
                                                exclusion.push(filter.id);
                                            }

                                            if (filter.name === 'Unknown Players') {
                                                exclusion.push(filter.id);
                                            }

                                            var excluded = exclusion.some(function(excludedFilterId) {
                                                return filter.id === excludedFilterId;
                                            });

                                            if (!excluded) {
                                                data.filtersetCategories[filter.filterCategoryId].subFilters.push(filter);
                                            }

                                        });

                                        angular.forEach(data.gamePlayerLists[data.game.opposingTeamId], function(player) {
                                            var playerFilter = {
                                                id: playerFilterTemplate.id,
                                                teamId: data.game.opposingTeamId,
                                                playerId: player.id,
                                                name: player.firstName[0] + '. ' + player.lastName,
                                                filterCategoryId: playerFilterTemplate.filterCategoryId,
                                                customFilter: true
                                            };
                                            data.filtersetCategories[playerFilter.filterCategoryId].subFilters.push(playerFilter);
                                        });

                                        angular.forEach(data.gamePlayerLists[data.game.teamId], function(player) {
                                            var playerFilter = {
                                                id: playerFilterTemplate.id,
                                                teamId: data.game.teamId,
                                                playerId: player.id,
                                                name: player.firstName[0] + '. ' + player.lastName,
                                                filterCategoryId: playerFilterTemplate.filterCategoryId,
                                                customFilter: true
                                            };
                                            data.filtersetCategories[playerFilter.filterCategoryId].subFilters.push(playerFilter);
                                        });

                                        return data;
                                    }
                                }
                            });
                        });
                    }
                ]
            }
        };

        $stateProvider.state(gameArea);

    }
]);

Breakdown.controller('Coach.GameArea.Breakdown.controller', [
    '$scope', '$state', '$stateParams', 'LeaguesFactory', 'GamesFactory', 'PlaysFactory', 'FiltersetsFactory', 'Coach.Data',
    function controller($scope, $state, $stateParams, leagues, games, plays, filtersets, data) {

        $scope.gameId = $state.params.id;
        $scope.videoTitle = 'filmBreakdown';
        $scope.data = data;
        $scope.teamId = data.game.teamId;
        $scope.leagues = leagues.getCollection();
        $scope.league = $scope.leagues[$scope.team.leagueId];
        $scope.expandAll = false;
        $scope.filterCategory = data.filterset.categories[0].id;
        $scope.activeFilters = [];
        $scope.filterMenu = {
            isOpened: false
        };

        //Player List
        $scope.teamPlayerList = data.gamePlayerLists[data.game.teamId];
        $scope.opposingPlayerList = data.gamePlayerLists[data.game.opposingTeamId];

        //Plays
        $scope.totalPlays = angular.copy(data.plays);
        $scope.plays = $scope.totalPlays;

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
