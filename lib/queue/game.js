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
            }
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
    '$scope', '$state', '$stateParams', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'AlertsService', 'UsersFactory', 'GamesFactory', 'SchoolsFactory', 'TeamsFactory', 'SportsFactory', 'LeaguesFactory',
    function controller($scope, $state, $stateParams, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES, GAME_NOTE_TYPES,  alerts, users, games, schools, teams, sports, leagues) {

        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        var gameId = $stateParams.id;

        games.get(gameId, function(game) {

            $scope.game = game;

            alerts.add({

                type: game.status == GAME_STATUSES.INDEXED.id ? 'success' : 'warning',
                message: 'Game Status: ' + GAME_STATUSES[GAME_STATUS_IDS[game.status]].name
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
    }
]);
