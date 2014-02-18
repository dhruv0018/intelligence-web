
/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Indexer Game page module.
 * @module Game
 */
var Game = angular.module('indexer-game');

/**
 * Game controller.
 * @module Game
 * @name Controller
 * @type {Controller}
 */
Game.controller('indexer-game.Controller', [
    '$scope', '$state', '$stateParams', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'AlertsService', 'UsersFactory', 'GamesFactory', 'SchoolsFactory', 'TeamsFactory', 'SportsFactory', 'LeaguesFactory',
    function controller($scope, $state, $stateParams, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES, GAME_NOTE_TYPES,  alerts, users, games, schools, teams, sports, leagues) {

        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        var gameId = $stateParams.id;

        games.get(gameId, function(game) {

            $scope.game = game;

            $scope.isIndexingReady = $scope.game.status.id == GAME_STATUSES.INDEXING.id;
            $scope.isQaReady = $scope.game.status.id == GAME_STATUSES.QAING.id;
            $scope.isReady = $scope.isIndexingReady || $scope.isQaReady;

            leagues.get(game.teamId, function(league) {

                $scope.sport = sports.get(league.sportId);
            });

            teams.get(game.teamId, function(team) {

                $scope.teamName = team.name;

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
