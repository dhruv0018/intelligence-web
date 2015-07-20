
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
    '$scope',
    '$state',
    '$stateParams',
    '$modal',
    'GAME_STATUSES',
    'GAME_STATUS_IDS',
    'GAME_TYPES',
    'GAME_NOTE_TYPES',
    'SessionService',
    'AlertsService',
    'RawFilm.Modal',
    'Indexer.Game.Data',
    'BasicModals',
    'SportsFactory',
    'LeaguesFactory',
    'SchoolsFactory',
    'TeamsFactory',
    'GamesFactory',
    'UsersFactory',
    'EMAIL_REQUEST_TYPES',
    function controller(
        $scope,
        $state,
        $stateParams,
        $modal,
        GAME_STATUSES,
        GAME_STATUS_IDS,
        GAME_TYPES,
        GAME_NOTE_TYPES,
        session,
        alerts,
        RawFilmModal,
        data,
        basicModal,
        sports,
        leagues,
        schools,
        teams,
        games,
        users,
        EMAIL_REQUEST_TYPES
    ) {

        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        $scope.RawFilmModal = RawFilmModal;

        const gameId = $stateParams.id;

        $scope.game = games.get(gameId);

        $scope.currentAssignment = $scope.game.currentAssignment();

        $scope.team = teams.get($scope.game.teamId);
        $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
        var league = leagues.get($scope.team.leagueId);
        $scope.sport = sports.get(league.sportId);

        if ($scope.team.schoolId) {
            $scope.school = schools.get($scope.team.schoolId);
        }

        var headCoachRole = $scope.team.getHeadCoachRole();

        if (headCoachRole) {

            $scope.headCoach = users.get(headCoachRole.userId);
        }

        $scope.revertAssignment = function() {
            var previousAssignment = $scope.game.findLastIndexerAssignment();
            $scope.game.revert();

            var remainingTime = $scope.game.getRemainingTime(teams.get($scope.game.uploaderTeamId));

            //half of the remaining time
            var newDeadline = moment.utc().add(remainingTime / 2, 'milliseconds');

            $scope.game.assignToIndexer(previousAssignment.userId, newDeadline);
            $scope.game.save();
            $state.go('indexer-games');
        };

        $scope.setAside = function() {
            const roleId = session.getCurrentRole().type.id;
            const userId = session.getCurrentUserId();
            const modalInstance = basicModal.openForConfirm({
                title: 'Set aside this Game?',
                bodyText: 'Are you sure you want to set aside this game?'
            });

            modalInstance.result.then(function() {
                $scope.game.setAside();
                $scope.game.save();
                users.resendEmail(EMAIL_REQUEST_TYPES.SET_ASIDE_EMAIL, {roleType: roleId, gameId: gameId}, userId);
                $state.go('indexer-games');
            });
        };

    }
]);
