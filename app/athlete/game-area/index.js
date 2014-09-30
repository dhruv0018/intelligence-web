/* Component dependencies */
require('raw-film');
require('breakdown');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Add Film page module.
 * Game Area page module.
 * @module GameArea
 */
var GameArea = angular.module('Athlete.GameArea', [
    'ui.router',
    'ui.bootstrap',
    'Athlete.GameArea.RawFilm',
    'Athlete.GameArea.Breakdown'
]);

/* Cache the template file */
GameArea.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('athlete/game-area/template.html', require('./template.html'));
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

        .state('Athlete.GameArea', {
            url: '/game/:id',
            views: {
                'main@root': {
                    templateUrl: 'athlete/game-area/template.html',
                    controller: 'Athlete.GameArea.controller'
                }
            },
            resolve: {
                'Athlete.Data': [
                    '$q', '$stateParams', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'PlayersFactory', 'PlaysFactory', 'SessionService',  'FILTERSET_CATEGORIES', 'GAME_STATUS_IDS', 'Athlete.Data.Dependencies',
                    function($q, $stateParams, leagues, teams, games, players, plays, session, FILTERSET_CATEGORIES, GAME_STATUS_IDS, data) {
                        return $q.all(data).then(function(data) {

                            var gameId = $stateParams.id;

                            /* TODO: Maybe not do this. */
                            var game = games.get(gameId);
                            data.game = game;

                            /* TODO: Or this. */
                            var team = teams.get(game.teamId);
                            var league = leagues.get(team.leagueId);
                            data.league = league;

                            return data;
                        });
                    }
                ]
            },
            onEnter: [
                '$state', 'Athlete.Data',
                function($state, data) {
                    if (data.game.isDeleted) {
                        $state.go('Athlete.FilmHome');
                    }
                }
            ],
            onExit: [
                'Athlete.Data',
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
GameArea.controller('Athlete.GameArea.controller', [
    '$scope', '$state', '$stateParams', 'TeamsFactory', 'PlayersFactory', 'GAME_STATUS_IDS', 'GAME_STATUSES', 'Athlete.Data', 'SPORTS', 'PlayManager',
    function controller($scope, $state, $stateParams, teams, players, GAME_STATUS_IDS, GAME_STATUSES, data, SPORTS, playManager) {
        $scope.hasShotChart = false;
        $scope.hasStatistics = true;
        $scope.hasFormations = false;
        $scope.hasDownAndDistance = false;
        $scope.expandAll = false;
        $scope.data = data;
        $scope.play = playManager;

        if (data.league.sportId == SPORTS.BASKETBALL.id) {
            $scope.hasShotChart = true;
        }

        if (data.league.sportId == SPORTS.FOOTBALL.id) {
            $scope.hasFormations = true;
            $scope.hasDownAndDistance = true;
            $scope.hasStatistics = false;
        }

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

        //view selector
        if ($scope.game.isDelivered()) {
            $scope.dataType = 'film-breakdown';
        } else {
            $scope.dataType = 'raw-film';
        }
        $scope.$watch('dataType', function(data) {
            if ($scope.dataType === 'raw-film') {
                $state.go('Athlete.GameArea.RawFilm');
            } else if ($scope.dataType === 'film-breakdown') {
                $state.go('Athlete.GameArea.Breakdown');
            } else {
                $state.go('Athlete.GameArea');
            }
        });

    }
]);

