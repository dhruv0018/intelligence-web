
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
    '$scope', '$state', '$stateParams', '$modal', 'GAME_STATUSES', 'GAME_STATUS_IDS', 'GAME_TYPES', 'GAME_NOTE_TYPES', 'SessionService', 'AlertsService', 'RawFilm.Modal', 'Indexer.Game.Data', 'BasicModals',
    function controller($scope, $state, $stateParams, $modal, GAME_STATUSES, GAME_STATUS_IDS, GAME_TYPES, GAME_NOTE_TYPES, session, alerts, RawFilmModal, data, basicModal) {

        $scope.GAME_TYPES = GAME_TYPES;
        $scope.GAME_STATUSES = GAME_STATUSES;
        $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
        $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

        $scope.RawFilmModal = RawFilmModal;

        var gameId = $stateParams.id;

        $scope.game = data.games.get(gameId);
        $scope.team = data.teams.get($scope.game.teamId);
        $scope.opposingTeam = data.teams.get($scope.game.opposingTeamId);
        var league = data.leagues.get($scope.team.leagueId);
        $scope.sport = data.sports.get(league.sportId);
        $scope.school = data.schools.get($scope.team.schoolId);

        var headCoachRole = $scope.team.getHeadCoachRole();

        if (headCoachRole) {

            $scope.headCoach = data.users.get(headCoachRole.userId);
        }

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
