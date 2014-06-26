require('./gameAreaInformation.js');
require('./gameAreaFilm.js');
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
    'game-area-film',
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
                    '$q', '$stateParams', 'PlayersFactory', 'PlaysFactory', 'FiltersetsFactory', 'SessionService',  'FILTERSET_CATEGORIES', 'GAME_STATUS_IDS', 'Coach.Data.Dependencies',
                    function($q, $stateParams, players, plays, filtersets, session, FILTERSET_CATEGORIES, GAME_STATUS_IDS, data) {
                        return $q.all(data).then(function(data) {
                            var gamesCollection = data.games.getCollection();
                            var teamsCollection = data.teams.getCollection();
                            var leaguesCollection = data.leagues.getCollection();

                            //Game related
                            data.game = gamesCollection[$stateParams.id];
                            data.gameStatus = data.game.status;
                            data.gamePlayerLists = {};
                            data.league = leaguesCollection[teamsCollection[data.game.teamId].leagueId];

                            //Player lists
                            var teamPlayerList = players.query({
                                roster: data.game.rosters[data.game.teamId].id
                            }).then(function(playerList) {
                                data.gamePlayerLists[data.game.teamId] = playerList;
                            });

                            var opposingTeamPlayerList = players.query({
                                roster: data.game.rosters[data.game.opposingTeamId].id
                            }).then(function(playerList) {
                                data.gamePlayerLists[data.game.opposingTeamId] = playerList;
                            });

                            var playsList = plays.query({
                                gameId: data.game.id
                            }, function(plays) {
                                data.plays = plays;
                            });

                            return $q.all([teamPlayerList, opposingTeamPlayerList, playsList]).then(function() {
                                //Filtersets
                                if (GAME_STATUS_IDS[data.game.status] === 'INDEXED') {
                                    try {
                                        //TODO remove hardcoded exclusion list
                                        var exclusion = [];

                                        //TODO do not hardcode
                                        //filtersets.get(data.league.filterSetId, function(filterset) {
                                        filtersets.fetch('2', function(filterset) {
                                            data.filtersetCategories = {};

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
                                            return $q.all(data);
                                        });


                                    } catch (e) {
                                        console.log('corrupted game');
                                        console.log(e);
                                    }
                                }


                                return data;
                            });

                        });
                    }
                ]
            },
            onEnter: [
                '$state', 'Coach.Data',
                function($state, data) {
                    console.log(data);
                    if (data.game.isDeleted) {
                        $state.go('Coach.FilmHome');
                    }
                }
            ],
            onExit: [
                'Coach.Data', 'Coach.Game.Tabs',
                function(data, tabs) {
                    delete data.game;
                    tabs.reset();
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
    '$scope', '$state', '$stateParams', '$localStorage', 'PlayersFactory', 'GAME_STATUS_IDS', 'Coach.Data',
    function controller($scope, $state, $stateParams, $localStorage, players, GAME_STATUS_IDS, data) {
        $scope.hasShotChart = false;
        $scope.hasStatistics = true;
        $scope.hasFormations = true;
        $scope.hasDownAndDistance = true;
        $scope.expandAll = false;

        $scope.data = data;


        //Game Related
        $scope.game = data.game;
        $scope.gameStatus = GAME_STATUS_IDS[$scope.game.status];
        $scope.sources = $scope.game.getVideoSources();

        //Collections
        $scope.teams = data.teams.getCollection();
        $scope.team = data.teams[data.game.teamId];

        //Player List
        $scope.teamPlayerList = data.gamePlayerLists[data.game.teamId];
        $scope.opposingPlayerList = data.gamePlayerLists[data.game.opposingTeamId];

        //Teams
        $scope.team = data.teams[$scope.game.teamId];
        $scope.opposingTeam = data.teams[$scope.game.opposingTeamId];

        //view selector
        $scope.dataType = 'video';
        $scope.$watch('dataType', function(data) {
            if ($scope.dataType === 'game-info') {
                $state.go('ga-info');
            } else if ($scope.dataType === 'video') {
                $state.go('ga-film');
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

