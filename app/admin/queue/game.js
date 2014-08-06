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
    'ROLE_TYPE', 'SportsFactory', 'LeaguesFactory', 'SchoolsFactory', 'TeamsFactory', 'GamesFactory', 'UsersFactory',
    function(ROLE_TYPE, sports, leagues, schools, teams, games, users) {

        var Data = {

            sports: sports.load(),
            leagues: leagues.load(),
            schools: schools.load(),
            teams: teams.load(),
            games: games.load(),
            users: users.load(),
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
                    '$q', 'Admin.Game.Data.Dependencies',
                    function($q, data) {
                        return $q.all(data);
                    }
                ]
            },
            onEnter: [
                '$stateParams', 'GAME_STATUSES', 'AlertsService', 'Admin.Game.Data',
                function($stateParams, GAME_STATUSES, alerts, data) {

                    var gameId = $stateParams.id;

                    var game = data.games.get(gameId);

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
    '$scope', '$stateParams', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'Admin.Game.Data', 'RawFilm.Modal', 'DeleteGame.Modal', 'SelectIndexer.Modal',
    function controller($scope, $stateParams, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES, GAME_NOTE_TYPES,  data, RawFilmModal, DeleteGameModal, SelectIndexerModal) {

        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        $scope.DeleteGameModal = DeleteGameModal;
        $scope.RawFilmModal = RawFilmModal;
        $scope.SelectIndexerModal = SelectIndexerModal;

        var gameId = $stateParams.id;

        $scope.data = data;
        $scope.game = data.games.get(gameId);
        $scope.team = data.teams.get($scope.game.teamId);
        $scope.teams = data.teams.getCollection();
        $scope.opposingTeam = data.teams.get($scope.game.opposingTeamId);
        $scope.league = data.leagues.get($scope.team.leagueId);
        $scope.sport = data.sports.get($scope.league.sportId);
        if ($scope.team.schoolId) {
            $scope.school = data.schools.get($scope.team.schoolId);
        }
        $scope.users = data.users.getList();

        var headCoachRole = $scope.team.getHeadCoachRole();

        if (headCoachRole) {

            $scope.headCoach = data.users.get(headCoachRole.userId);
        }

        $scope.deliverTime = $scope.game.getRemainingTime($scope.teams[$scope.game.uploaderTeamId]);
        if ($scope.deliverTime === 0) {
            $scope.deliverTime = 'None';
        }

        $scope.assignedToIndexer = $scope.game.isAssignedToIndexer();
        $scope.assignedToQa = $scope.game.isAssignedToQa();
        console.log($scope.assignedToQa);

        $scope.indexTime = $scope.game.assignmentTimeRemaining();

        $scope.gameLength = Math.round($scope.game.video.duration);

        var uploadedDate = new Date($scope.game.createdAt);
        $scope.uploadDate = (uploadedDate.getMonth() + 1) + '/' + uploadedDate.getDate() + '/' + uploadedDate.getFullYear();
    }
]);
