/* Component dependencies */
require('raw-film');
require('breakdown');

require('./gameAreaInformation.js');
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
    'Coach.GameArea.RawFilm',
    'Coach.GameArea.Breakdown',
    'game-area-information',
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
            resolve: {
                'Coach.Data': [
                    '$q', '$stateParams', 'LeaguesFactory', 'FiltersetsFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'SessionService',  'FILTERSET_CATEGORIES', 'GAME_STATUS_IDS', 'Coach.Data.Dependencies',
                    function($q, $stateParams, leagues, filtersets, teams, games, players, plays, session, FILTERSET_CATEGORIES, GAME_STATUS_IDS, data) {
                        return $q.all(data).then(function(data) {

                            var gameId = $stateParams.id;

                            /* TODO: Maybe not do this. */
                            var game = games.get(gameId);
                            data.game = game;

                            /* TODO: Or this. */
                            var team = teams.get(game.teamId);
                            var league = leagues.get(team.leagueId);
                            data.league = league;

                            var teamsCollection = teams.getCollection();
                            var leaguesCollection = leagues.getCollection();

                            //Game related
                            data.game = games.get($stateParams.id);
                            data.gameStatus = data.game.status;
                            data.gamePlayerLists = {};
                            data.players = players;
                            data.league = leaguesCollection[teamsCollection[data.game.teamId].leagueId];
                            data.filterset = filtersets.get(data.league.filterSetId);

                            //Player lists
                            var teamPlayerList = players.query({
                                rosterId: data.game.rosters[data.game.teamId].id
                            }).then(function(playerList) {
                                data.teamPlayers = playerList;
                                data.gamePlayerLists[data.game.teamId] = playerList;
                            });

                            var opposingTeamPlayerList = players.query({
                                rosterId: data.game.rosters[data.game.opposingTeamId].id
                            }).then(function(playerList) {
                                data.opposingTeamPlayers = playerList;
                                data.gamePlayerLists[data.game.opposingTeamId] = playerList;
                            });

                            var playsList = plays.query({
                                gameId: data.game.id
                            }, function(plays) {
                                data.plays = plays;
                            });


                            return $q.all([teamPlayerList, opposingTeamPlayerList, playsList]).then(function() {
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
    '$scope', '$state', '$stateParams', 'PlayersFactory', 'GAME_STATUS_IDS', 'GAME_STATUSES', 'Coach.Data', 'SPORTS', 'PlayManager', 'TeamsFactory',
    function controller($scope, $state, $stateParams, players, GAME_STATUS_IDS, GAME_STATUSES, data, SPORTS, playManager, teams) {
        $scope.expandAll = false;
        $scope.data = data;
        $scope.play = playManager;

        //constants
        $scope.GAME_STATUSES = GAME_STATUSES;

        //Game Related
        $scope.game = data.game;
        $scope.gameStatus = GAME_STATUS_IDS[$scope.game.status];
        $scope.sources = $scope.game.getVideoSources();
        $scope.returnedDate = ($scope.game.isDelivered()) ? new Date($scope.game.currentAssignment().timeFinished) : null;

        //Collections
        $scope.teams = teams.getCollection();

        //Teams
        $scope.team = $scope.teams[$scope.game.teamId];
        $scope.opposingTeam = $scope.teams[$scope.game.opposingTeamId];

        //Filters
        $scope.filtersetCategories = data.filtersetCategories;

        //Plays
        $scope.totalPlays = angular.copy(data.plays);
        $scope.plays = $scope.totalPlays;

        //define states for view selector
        $scope.gameStates = [];

        if ($scope.game.isVideoTranscodeComplete() && $scope.game.isDelivered()) {
            $scope.gameStates.push(
                {
                    name: 'Film Breakdown',
                    state: 'Coach.GameArea.Breakdown'
                },
                {
                    name: 'Raw Film',
                    state: 'Coach.GameArea.RawFilm'
                }
            );

            if (data.league.sportId == SPORTS.BASKETBALL.id) {
                $scope.gameStates.push(
                    {
                        name: 'Shot Chart',
                        state: 'ga-shot-chart'
                    }
                );
            } else if (data.league.sportId == SPORTS.FOOTBALL.id) {
                $scope.gameStates.push(
                    {
                        name: 'Formation Report',
                        state: 'ga-formations'
                    },
                    {
                        name: 'Down and Distance Report',
                        state: 'ga-down-distance'
                    }
                );
            } else if (data.league.sportId == SPORTS.VOLLEYBALL.id) {
                $scope.gameStates.push(
                    {
                        name: 'Statistics',
                        state: 'ga-statistics'
                    }
                );
            }
        } else if ($scope.game.isVideoTranscodeComplete() && !$scope.game.isDelivered()) {
            $scope.gameStates.push(
                {
                    name: 'Raw Film',
                    state: 'Coach.GameArea.RawFilm'
                }
            );
        }

        $scope.gameStates.push(
            {
                name: 'Game Information',
                state: 'ga-info'
            }
        );
    }
]);

