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
            onExit: [
                'AlertsService',
                function(alerts) {

                    alerts.clear();
                }
            ]
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
    '$scope', '$state', '$stateParams', '$modal', 'DeleteGame.Modal', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'AlertsService', 'UsersFactory', 'GamesFactory', 'SchoolsFactory', 'TeamsFactory', 'SportsFactory', 'LeaguesFactory',
    function controller($scope, $state, $stateParams, $modal, deleteModal, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES, GAME_NOTE_TYPES,  alerts, users, games, schools, teams, sports, leagues) {

        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        var gameId = $stateParams.id;

        games.get(gameId, function(game) {

            $scope.game = game;

            var status = game.getStatus();

            alerts.add({
                type: status.type,
                message: status.name
            });

            teams.get(game.teamId, function(team) {

                $scope.teamName = team.name;

                leagues.get(team.leagueId, function(league) {

                    $scope.sport = sports.get(league.sportId);
                });

                schools.get(team.schoolId, function(school) {

                    $scope.school = school;
                });

                var headCoachRole = team.getHeadCoachRole();

                if (headCoachRole) {

                    users.get(headCoachRole.userId, function(user) {

                        $scope.headCoach = user;
                    });
                }

            });

            teams.get(game.opposingTeamId, function(team) {

                $scope.opposingTeamName = team.name;
            });
        });

        users.getList(function(users) { $scope.users = users; }, null, true);

        $scope.delete = function(game) {
            $modal.open(deleteModal);
        };

        $scope.selectIndexer = function(isQa) {

            $scope.selectedGame = $scope.game;
            $scope.isQa = isQa;

            $modal.open({

                scope: $scope,
                controller: 'ModalController',
                templateUrl: 'select-indexer.html'

            }).result.then(function() {

                $scope.selectedGame.save();

                /* NOTE: There is a bug in UI-router:
                 * https://github.com/angular-ui/ui-router/wiki/Quick-Reference#wiki-statereload
                 */

                /* FIXME: Due to bug in UI-router; the controller is not
                 * reinstentiated when the state is reloaded, but it should be
                 * this simple:
                 * $state.reload();
                 */

                games.get($scope.selectedGame.id, function(game) {

                    $scope.game = game;

                    alerts.clear();
                    alerts.add({

                        type: game.status == GAME_STATUSES.INDEXED.id ? 'success' : 'warning',
                        message: 'Game Status: ' + GAME_STATUSES[GAME_STATUS_IDS[game.status]].name
                    });
                });
            });
        };
    }
]);
