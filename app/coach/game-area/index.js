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
            resolve: {
                'Coach.Data': [
                    '$q', '$stateParams', 'PlayersFactory', 'PlaysFactory', 'GamesFactory', 'SessionService',  'FILTERSET_CATEGORIES', 'GAME_STATUS_IDS', 'Coach.Data.Dependencies',
                    function($q, $stateParams, players, plays, games, session, FILTERSET_CATEGORIES, GAME_STATUS_IDS, data) {
                        return $q.all(data).then(function(data) {
                            var teamsCollection = data.teams.getCollection();
                            var leaguesCollection = data.leagues.getCollection();

                            //Game related
                            data.game = games.get($stateParams.id);
                            data.gameStatus = data.game.status;
                            data.gamePlayerLists = {};
                            data.players = players;
                            data.league = leaguesCollection[teamsCollection[data.game.teamId].leagueId];
                            data.filterset = data.filtersets.get(data.league.filterSetId);

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
    '$scope', '$state', '$stateParams', 'PlayersFactory', 'GAME_STATUS_IDS', 'GAME_STATUSES', 'Coach.Data', 'SPORTS', 'PlayManager', 'SessionService',
    function controller($scope, $state, $stateParams, players, GAME_STATUS_IDS, GAME_STATUSES, data, SPORTS, playManager, session) {
        $scope.expandAll = false;
        $scope.data = data;
        $scope.play = playManager;
        $scope.currentUser = session.currentUser;

        //constants
        $scope.GAME_STATUSES = GAME_STATUSES;

        //Game Related
        $scope.game = data.game;
        $scope.gameStatus = GAME_STATUS_IDS[$scope.game.status];
        $scope.sources = $scope.game.getVideoSources();
        $scope.returnedDate = ($scope.game.isDelivered()) ? new Date($scope.game.currentAssignment().timeFinished) : null;

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

        //define states for view selector
        $scope.gameStates = [];

        if ($scope.game.isVideoTranscodeComplete() && $scope.game.isDelivered()) {
            $scope.gameStates.push(
                {
                    name: 'Film Breakdown',
                    state: 'ga-film-breakdown'
                },
                {
                    name: 'Raw Film',
                    state: 'ga-raw-film'
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
        } else if ($scope.game.isVideoTranscodeComplete() && !$scope.game.isDelivered() || $scope.game.isSharedWithUser(session.currentUser)) {
            $scope.gameStates.push(
                {
                    name: 'Raw Film',
                    state: 'ga-raw-film'
                }
            );
        }

        if (!$scope.game.isSharedWithUser(session.currentUser)) {
            $scope.gameStates.push(
                {
                    name: 'Game Information',
                    state: 'ga-info'
                }
            );
        }
    }
]);

