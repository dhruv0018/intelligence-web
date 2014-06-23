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
    'ROLE_TYPE', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'GamesFactory', 'UsersFactory',
    function(ROLE_TYPE, sports, leagues, teams, games, users) {

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
    '$q', '$stateProvider', '$urlRouterProvider',
    function config($q, $stateProvider, $urlRouterProvider) {

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
            }
        };

        $stateProvider.state(game);
    }
]);

/**
 * Modal controller. Controls the modal views.
 * @module Game
 * @name ModalController
 * @type {Controller}
 */
Game.controller('ModalController', [
    '$rootScope', '$scope', '$state', '$modal', '$modalInstance', '$localStorage', 'ROLE_TYPE', 'GAME_STATUS_IDS', 'GAME_STATUSES', 'GamesFactory', 'SportsFactory', 'LeaguesFactory', 'TeamsFactory', 'UsersFactory',
    function controller($rootScope, $scope, $state, $modal, $modalInstance, $localStorage, ROLE_TYPE, GAME_STATUS_IDS, GAME_STATUSES, games, sports, leagues, teams, users) {

        $scope.ok = function() {

            $modalInstance.close();
        };

        $scope.cancel = function() {

            $modalInstance.dismiss('cancel');
        };
    }
]);

/**
 * Game controller.
 * @module Game
 * @name GameController
 * @type {Controller}
 */
Game.controller('GameController', [
    '$scope', '$state', '$stateParams', '$modal', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'AlertsService', 'Admin.Game.Data', 'RawFilm.Modal', 'DeleteGame.Modal',
    function controller($scope, $state, $stateParams, $modal, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES, GAME_NOTE_TYPES,  alerts, data, RawFilmModal, DeleteGameModal) {

        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        $scope.DeleteGameModal = DeleteGameModal;
        $scope.RawFilmModal = RawFilmModal;

        var gameId = $stateParams.id;

        $scope.game = data.games.get(gameId);

        var status = $scope.game.getStatus();

        alerts.add({
            type: status.type,
            message: status.name
        });

        var team = data.teams.get($scope.game.teamId);

        $scope.teamName = team.name;

        var league = data.leagues.get(team.leagueId);

        $scope.sport = data.sports.get(league.sportId);

        $scope.school = data.schools.get(team.schoolId);

        var headCoachRole = team.getHeadCoachRole();

        if (headCoachRole) {

            $scope.headCoach = data.users.get(headCoachRole.userId);
        }

        var opposingTeam = data.teams.get($scope.game.opposingTeamId);

        $scope.opposingTeamName = opposingTeam.name;

        $scope.users = data.users.getList();

        $scope.selectIndexer = function(isQa) {

            $scope.selectedGame = $scope.game;
            $scope.isQa = isQa;

            $modal.open({

                scope: $scope,
                controller: 'ModalController',
                templateUrl: 'select-indexer.html'

            }).result.then(function() {

                $scope.selectedGame.save();

                /* FIXME: Might not need this anymore: */
                $scope.game = data.games.get($scope.selectedGame.id);

                alerts.clear();
                alerts.add({

                    type: $scope.game.status == GAME_STATUSES.INDEXED.id ? 'success' : 'warning',
                    message: 'Game Status: ' + GAME_STATUSES[GAME_STATUS_IDS[$scope.game.status]].name
                });
            });
        };

    }
]);
