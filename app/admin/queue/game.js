/* Component settings */
var templateUrl = 'game.html';

/* Component resources */
var template = require('./game.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Game info page module.
 * @module Game
 */
var Game = angular.module('game', []);

/* Cache the template file */
Game.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
        $templateCache.put('select-indexer.html', require('./select-indexer.html'));
    }
]);

/**
 * Admin Game data dependencies.
 * @module Game
 * @type {service}
 */
Game.service('Admin.Game.Data.Dependencies', [
    'ROLE_TYPE', 'GAME_STATUSES', 'VIDEO_STATUSES', 'SportsFactory', 'LeaguesFactory','TeamsFactory', 'GamesFactory', 'UsersFactory',
    function(ROLE_TYPE, GAME_STATUSES, VIDEO_STATUSES, sports, leagues, teams, games, users) {

        var statuses = [
            GAME_STATUSES.READY_FOR_INDEXING.id,
            GAME_STATUSES.INDEXING.id,
            GAME_STATUSES.READY_FOR_QA.id,
            GAME_STATUSES.QAING.id,
            GAME_STATUSES.SET_ASIDE.id
        ];

        var Data = {

            sports: sports.load(),
            leagues: leagues.load(),
            users: users.load({ 'relatedGameStatus[]': statuses }),
            teams: teams.load({ 'relatedGameStatus[]': statuses }),
            games: games.load({ 'status[]': statuses, videoStatus: VIDEO_STATUSES.COMPLETE.id })
        };

        return Data;
    }
]);

/**
 * Game page state router.
 * @module Game
 * @type {UI-Router}
 */
Game.config([
    '$stateProvider', '$urlRouterProvider',
    function config($stateProvider, $urlRouterProvider) {

        var game = {
            name: 'game',
            url: '/game/:id',
            parent: 'base',
            views: {
                'main@root': {
                    templateUrl: 'game.html',
                    controller: 'GameController'
                }
            },
            resolve: {
                'Admin.Game.Data': [
                    '$q', '$stateParams', 'Admin.Game.Data.Dependencies', 'SchoolsFactory', 'TeamsFactory', 'GamesFactory',
                    function($q, $stateParams, data, schools, teams, games) {

                        return $q.all(data).then(function(data) {
                            var game = games.get($stateParams.id);
                            var team = teams.get(game.teamId);

                            if (team.schoolId) {
                                data.school = schools.fetch(team.schoolId);
                            }

                            return $q.all(data);
                        });
                    }
                ]
            },
            onEnter: [
                '$stateParams', 'GAME_STATUSES', 'AlertsService', 'Admin.Game.Data', 'GamesFactory',
                function($stateParams, GAME_STATUSES, alerts, data, games) {

                    var gameId = $stateParams.id;

                    var game = games.get(gameId);

                    alerts.add({
                        type: game.isDelivered() ? 'success' : 'warning',
                        message: game.getStatus()
                    });
                }
            ]
        };

        $stateProvider.state(game);
    }
]);

/**
 * Game controller.
 * @module Game
 * @name GameController
 * @type {Controller}
 */
Game.controller('GameController', [
    '$scope', '$stateParams', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'Admin.Game.Data', 'RawFilm.Modal', 'DeleteGame.Modal', 'SelectIndexer.Modal', 'UsersFactory', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'RevertGameStatus.Modal',
    function controller($scope, $stateParams, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES, GAME_NOTE_TYPES,  data, RawFilmModal, DeleteGameModal, SelectIndexerModal, users, sports, leagues, teams, games, RevertGameStatusModal) {

        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        $scope.DeleteGameModal = DeleteGameModal;
        $scope.RawFilmModal = RawFilmModal;
        $scope.SelectIndexerModal = SelectIndexerModal;
        $scope.RevertGameStatusModal = RevertGameStatusModal;

        var gameId = $stateParams.id;

        $scope.data = data;
        $scope.game = games.get(gameId);
        $scope.team = teams.get($scope.game.teamId);
        $scope.teams = teams.getCollection();
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
        $scope.league = leagues.get($scope.team.leagueId);
        $scope.sport = sports.get($scope.league.sportId);

        if (data.school) {
            $scope.school = data.school;
        }

        $scope.users = users.getList();

        var headCoachRole = $scope.team.getHeadCoachRole();

        if (headCoachRole) {

            $scope.headCoach = users.get(headCoachRole.userId);
        }

        $scope.deliverTime = $scope.game.getRemainingTime($scope.teams[$scope.game.uploaderTeamId]);
        if ($scope.deliverTime === 0) {
            $scope.deliverTime = 'None';
        }

        $scope.assignedToIndexer = $scope.game.isAssignedToIndexer();
        $scope.assignedToQa = $scope.game.isAssignedToQa();

        $scope.indexTime = $scope.game.assignmentTimeRemaining();

        $scope.gameLength = Math.round($scope.game.video.duration);

        var uploadedDate = new Date($scope.game.createdAt);
        $scope.uploadDate = (uploadedDate.getMonth() + 1) + '/' + uploadedDate.getDate() + '/' + uploadedDate.getFullYear();
    }
]);
