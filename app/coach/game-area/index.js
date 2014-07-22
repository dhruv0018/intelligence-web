require('./gameAreaInformation.js');
require('./gameAreaRawFilm.js');
require('./gameAreaFilmBreakdown.js');
require('./gameAreaStatistics.js');
require('./gameAreaShotChart.js');
require('./gameAreaFormations.js');
require('./gameAreaDownDistance.js');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Film page module.
 * Game Area page module.
 * @module GameArea
 */
var GameArea = angular.module('Coach.GameArea', [
    'ui.router',
    'ui.bootstrap',
    'Coach.Game',
    'game-area-information',
    'game-area-raw-film',
    'game-area-film-breakdown',
    'game-area-statistics',
    'game-area-shot-chart',
    'game-area-formations',
    'game-area-down-distance'
]);

/* Cache the template file */
GameArea.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('coach/game-area/template.html', require('./template.html'));
    }
]);

/**
 * GameArea page state router.
 * @module GameArea
 * @type {UI-Router}
 */
GameArea.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider

        .state('Coach.GameArea', {
            url: '/game/:id',
            views: {
                'main@root': {
                    templateUrl: 'coach/game-area/template.html',
                    controller: 'Coach.GameArea.controller'
                }
            },
//            resolve: {
//                'indexingData': ['$stateParams', 'IndexingService', function($stateParams, indexing) {
//                    return indexing.init($stateParams.id);
//                }]
//            },'
            resolve: {
                'Coach.Data': [
                    '$q', '$stateParams', 'PlayersFactory', 'PlaysFactory', 'TagsetsFactory', 'FiltersetsFactory', 'SessionService',  'FILTERSET_CATEGORIES', 'GAME_STATUS_IDS', 'Coach.Data.Dependencies',
                    function($q, $stateParams, players, plays, tagsets, filtersets, session, FILTERSET_CATEGORIES, GAME_STATUS_IDS, data) {
                        return $q.all(data).then(function(data) {
                            var gamesCollection = data.games.getCollection();
                            var teamsCollection = data.teams.getCollection();
                            var leaguesCollection = data.leagues.getCollection();

                            //Game related
                            data.game = gamesCollection[$stateParams.id];
                            data.gameStatus = data.game.status;
                            data.gamePlayerLists = {};
                            data.players = players;
                            data.league = leaguesCollection[teamsCollection[data.game.teamId].leagueId];

                            //Player lists
                            var teamPlayerList = players.query({
                                roster: data.game.rosters[data.game.teamId].id
                            }).then(function(playerList) {
                                data.teamPlayers = playerList;
                                data.gamePlayerLists[data.game.teamId] = playerList;
                            });

                            var opposingTeamPlayerList = players.query({
                                roster: data.game.rosters[data.game.opposingTeamId].id
                            }).then(function(playerList) {
                                data.opposingTeamPlayers = playerList;
                                data.gamePlayerLists[data.game.opposingTeamId] = playerList;
                            });

                            var playsList = plays.query({
                                gameId: data.game.id
                            }, function(plays) {
                                data.plays = plays;
                            });

                            return $q.all([teamPlayerList, opposingTeamPlayerList, playsList]).then(function(promisedData) {
                                //Filtersets
                                if (GAME_STATUS_IDS[data.game.status] === 'INDEXED') {
                                    var exclusion = [];
                                    if (data.league.tagSetId) {
                                        data.tagsets = tagsets.fetch(data.league.tagSetId);
                                    }
                                    if (data.league.filterSetId) {
                                        data.filtersetCategories = {};
                                        data.filtersets = filtersets.fetch(data.league.filterSetId, function(filterset) {
                                            angular.forEach(filterset.categories, function(filterCategory) {
                                                //TODO deal with player stuff later
                                                data.filtersetCategories[filterCategory.id] = filterCategory;
                                            });

                                            var playerFilterTemplate = {};

                                            angular.forEach(filterset.filters, function(filter) {
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
                                        });
                                    }
                                }

                                return $q.all(data);
                            });

                        });
                    }
                ]
            },
            onEnter: [
                '$state', 'Coach.Data',
                function($state, data) {
                    if (data.game.isDeleted) {
                        $state.go('Coach.FilmHome');
                    }
                }
            ],
            onExit: [
                'Coach.Data',
                function(data) {
                    delete data.game;
                }
            ]
        });
    }
]);

/**
 * GameArea controller.
 * @module GameArea
 * @name GameAreaController
 * @type {Controller}
 */
GameArea.controller('Coach.GameArea.controller', [
    '$scope', '$state', '$stateParams', 'PlayersFactory', 'GAME_STATUS_IDS', 'GAME_STATUSES', 'Coach.Data', 'SPORTS',
    function controller($scope, $state, $stateParams, players, GAME_STATUS_IDS, GAME_STATUSES, data, SPORTS) {
        $scope.hasShotChart = false;
        $scope.hasStatistics = true;
        $scope.hasFormations = false;
        $scope.hasDownAndDistance = false;
        $scope.expandAll = false;
        $scope.data = data;

        if (data.league.sportId == SPORTS.BASKETBALL.id) {
            $scope.hasShotChart = true;
        }

        if (data.league.sportId == SPORTS.FOOTBALL.id) {
            $scope.hasFormations = true;
            $scope.hasDownAndDistance = true;
        }

        //constants
        $scope.GAME_STATUSES = GAME_STATUSES;

        //Game Related
        $scope.game = data.game;
        $scope.gameStatus = GAME_STATUS_IDS[$scope.game.status];
        $scope.sources = $scope.game.getVideoSources();
        $scope.returnedDate = ($scope.gameStatus === 'INDEXED') ? new Date($scope.game.currentAssignment().timeFinished) : null;

        //Collections
        $scope.teams = data.teams.getCollection();

        //Player List
        $scope.teamPlayerList = data.gamePlayerLists[data.game.teamId];
        $scope.opposingPlayerList = data.gamePlayerLists[data.game.opposingTeamId];

        //Teams
        $scope.team = $scope.teams[$scope.game.teamId];
        $scope.opposingTeam = $scope.teams[$scope.game.opposingTeamId];

        //Plays
        $scope.totalPlays = angular.copy(data.plays);
        $scope.plays = $scope.totalPlays;

        //Filters
        $scope.filtersetCategories = data.filtersetCategories;

        //view selector
        if ($scope.gameStatus === 'INDEXED') {
            $scope.dataType = 'film-breakdown';
        } else {
            $scope.dataType = 'raw-film';
        }
        $scope.$watch('dataType', function(data) {
            if ($scope.dataType === 'game-info') {
                $state.go('ga-info');
            } else if ($scope.dataType === 'raw-film') {
                $state.go('ga-raw-film');
            } else if ($scope.dataType === 'film-breakdown') {
                $state.go('ga-film-breakdown');
            } else if ($scope.dataType === 'statistics') {
                $state.go('ga-statistics');
            } else if ($scope.dataType === 'shot-chart') {
                $state.go('ga-shot-chart');
            } else if ($scope.dataType === 'formation-report') {
                $state.go('ga-formations');
            } else if ($scope.dataType === 'down-distance-report') {
                $state.go('ga-down-distance');
            } else {
                $state.go('Coach.GameArea');
            }
        });

    }
]);

