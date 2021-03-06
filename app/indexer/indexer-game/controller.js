/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

IndexerGameController.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    '$uibModal',
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
    'SPORTS',
    'LeaguesFactory',
    'SchoolsFactory',
    'TeamsFactory',
    'GamesFactory',
    'UsersFactory',
    'EMAIL_REQUEST_TYPES',
    'STATES'
];

function IndexerGameController(
    $scope,
    $state,
    $stateParams,
    $uibModal,
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
    SPORTS,
    leagues,
    schools,
    teams,
    games,
    users,
    EMAIL_REQUEST_TYPES,
    STATES
) {

    const gameId = Number($stateParams.id);

    $scope.GAME_TYPES = GAME_TYPES;
    $scope.GAME_STATUSES = GAME_STATUSES;
    $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
    $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;

    $scope.RawFilmModal = RawFilmModal;

    $scope.game = games.get(gameId);

    $scope.currentAssignment = $scope.game.currentAssignment();

    $scope.team = teams.get($scope.game.teamId);
    $scope.opposingTeam = teams.get($scope.game.opposingTeamId);
    $scope.uploaderTeam = teams.get($scope.game.uploaderTeamId);
    $scope.league = leagues.get($scope.uploaderTeam.leagueId);

    let userId = session.getCurrentUserId();
    let userOwnsCurrentAssignment = userId === $scope.currentAssignment.userId;
    let currentAssignmentIsActive = $scope.currentAssignment.timeFinished === null;

    $scope.showSetAside =   ($scope.game.status === GAME_STATUSES.READY_FOR_INDEXING.id ||
                            $scope.game.status === GAME_STATUSES.INDEXING.id ||
                            $scope.game.status === GAME_STATUSES.READY_FOR_QA.id ||
                            $scope.game.status === GAME_STATUSES.QAING.id) &&
                            userOwnsCurrentAssignment &&
                            currentAssignmentIsActive;

    let uploaderTeam = teams.get($scope.game.uploaderTeamId);
    $scope.league = leagues.get(uploaderTeam.leagueId);
    $scope.showRevertToIndexing =   ($scope.game.status === GAME_STATUSES.READY_FOR_QA.id ||
                                    $scope.game.status === GAME_STATUSES.QAING.id) &&
                                    $scope.currentAssignment.isQa &&
                                    userOwnsCurrentAssignment &&
                                    currentAssignmentIsActive;

    const headCoachRole = uploaderTeam.getHeadCoachRole();
    const sport = sports.get($scope.league.sportId);

    $scope.sport = sport;
    $scope.isBasketballGame = sport.id === SPORTS.BASKETBALL.id;
    $scope.isLaxGame = sport.id === SPORTS.LACROSSE.id;
    $scope.isVolleyballGame = sport.id === SPORTS.VOLLEYBALL.id;
    $scope.isFootballGame = sport.id === SPORTS.FOOTBALL.id;
    $scope.isSoccerGame = sport.id === SPORTS.SOCCER.id;

    if ($scope.team.schoolId) {
        $scope.school = schools.get($scope.team.schoolId);
    }

    if (headCoachRole) {

        $scope.headCoach = users.get(headCoachRole.userId);
    }

    $scope.revertAssignment = function() {
        $scope.game.revertToLastIndexer();
        $scope.game.save();
        $state.go(STATES.INDEXER_GAMES_ASSIGNED);
    };

    $scope.setAside = function() {
        const roleTypeId = session.getCurrentRoleTypeId();
        const userId = session.getCurrentUserId();
        const modalInstance = basicModal.openForConfirm({
            title: 'Set aside this Game?',
            bodyText: 'Are you sure you want to set aside this game?'
        });

        modalInstance.result.then(function() {
            $scope.game.setAside();
            $scope.game.save();
            users.resendEmail(EMAIL_REQUEST_TYPES.SET_ASIDE_EMAIL, {roleType: roleTypeId, gameId: gameId}, userId);
            $state.go(STATES.INDEXER_GAMES);
        });
    };

}

export default IndexerGameController;
