
/* Fetch angular from the browser scope */
var angular = window.angular;
var moment = require('moment');

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
    '$scope', '$state', '$stateParams', '$modal', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'SessionService', 'AlertsService', 'RawFilm.Modal', 'Indexer.Game.Data', 'BasicModals', 'SchoolsFactory',
    function controller($scope, $state, $stateParams, $modal, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES, GAME_NOTE_TYPES, session, alerts, RawFilmModal, data, basicModal, schools) {

        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        $scope.RawFilmModal = RawFilmModal;

        var gameId = $stateParams.id;

        $scope.game = data.games.get(gameId);

        $scope.currentAssignment = $scope.game.currentAssignment();

        $scope.team = data.teams.get($scope.game.teamId);
        $scope.opposingTeam = data.teams.get($scope.game.opposingTeamId);
        var league = data.leagues.get($scope.team.leagueId);
        $scope.sport = data.sports.get(league.sportId);
        schools.fetch($scope.team.schoolId).then(function(school) {
            $scope.school = school;
        });

        var headCoachRole = $scope.team.getHeadCoachRole();

        if (headCoachRole) {

            $scope.headCoach = data.users.get(headCoachRole.userId);
        }

        $scope.revertAssignment = function() {
            var previousAssignment = $scope.game.findLastIndexerAssignment();
            $scope.game.revert();

            var remainingTime = $scope.game.getRemainingTime(data.teams.get($scope.game.uploaderTeamId));

            //half of the remaining time
            var newDeadline = moment.utc().add(remainingTime / 2, 'milliseconds');

            $scope.game.assignToIndexer(previousAssignment.userId, newDeadline);
            $scope.game.save();
            $state.go('indexer-games');
        };

        $scope.setAside = function() {
            var modalInstance = basicModal.openForConfirm({
                title: 'Set aside this Game?',
                bodyText: 'Are you sure you want to set aside this game?'
            });

            modalInstance.result.then(function() {
                $scope.game.setAside();
                $scope.game.save().then(function() {
                    $state.go('indexer-games');
                });
            });
        };

    }
]);
