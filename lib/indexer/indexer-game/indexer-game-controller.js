
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
    '$scope', '$state', '$stateParams', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'SessionService', 'AlertsService', 'UsersFactory', 'GamesFactory', 'SchoolsFactory', 'TeamsFactory', 'SportsFactory', 'LeaguesFactory',
    function controller($scope, $state, $stateParams, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES, GAME_NOTE_TYPES, session, alerts, users, games, schools, teams, sports, leagues) {

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

        $scope.goIndexing = function() {

            var game = $scope.game;
            var userId = session.currentUser.id;

            /* Get the users assignment. */
            var userAssignment = game.userAssignment(userId);

            /* If the users assignment is started. */
            if (game.isAssignmentStarted(userAssignment)) {

                $state.go('indexing', { id: $scope.game.id });
            }

            /* If the users assignment is not started. */
            else {

                /* Start it now. */
                game.startAssignment(userId, userAssignment);

                game.save().then(function() {

                    $state.go('indexing', { id: $scope.game.id });
                });
            }
        };
    }
]);
