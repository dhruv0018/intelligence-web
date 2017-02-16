AdminGameInfoGameSidebarController.$inject = [
    '$scope',
    'GAME_STATUSES',
    'GAME_STATUS_IDS',
    'GAME_TYPES_IDS',
    'GAME_TYPES',
    'GAME_NOTE_TYPES',
    'RawFilm.Modal',
    'DeleteGame.Modal',
    'SelectIndexer.Modal',
    'UsersFactory',
    'TeamsFactory',
    'GamesFactory',
    'RevertGameStatus.Modal',
    'LABELS',
    'LABELS_IDS',
    'PRIORITIES',
    'PRIORITIES_IDS',
    'SessionService',
    'EMAIL_REQUEST_TYPES',
    'BasicModals',
    '$state',
    '$stateParams'
];

function AdminGameInfoGameSidebarController (
    $scope,
    GAME_STATUSES,
    GAME_STATUS_IDS,
    GAME_TYPES_IDS,
    GAME_TYPES,
    GAME_NOTE_TYPES,
    RawFilmModal,
    DeleteGameModal,
    SelectIndexerModal,
    users,
    teams,
    games,
    RevertGameStatusModal,
    LABELS,
    LABELS_IDS,
    PRIORITIES,
    PRIORITIES_IDS,
    session,
    EMAIL_REQUEST_TYPES,
    basicModal,
    $state,
    $stateParams
) {
    const gameId = $scope.game.id;

    $scope.users = users.getCollection();
    $scope.GAME_TYPES_IDS = GAME_TYPES_IDS;
    $scope.GAME_TYPES = GAME_TYPES;
    $scope.GAME_STATUSES = GAME_STATUSES;
    $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
    $scope.GAME_NOTE_TYPES = GAME_NOTE_TYPES;
    $scope.PRIORITIES = PRIORITIES;
    $scope.PRIORITIES_IDS = PRIORITIES_IDS;
    $scope.LABELS = LABELS;
    $scope.LABELS_IDS = LABELS_IDS;
    $scope.DeleteGameModal = DeleteGameModal;
    $scope.RawFilmModal = RawFilmModal;
    $scope.SelectIndexerModal = SelectIndexerModal;
    $scope.RevertGameStatusModal = RevertGameStatusModal;
    $scope.team = $scope.game.teamId ? teams.get($scope.game.teamId) : null;
    $scope.opposingTeam = $scope.game.opposingTeamId ? teams.get($scope.game.opposingTeamId) : null;
    $scope.gameLength = Math.round($scope.game.video.duration);
    $scope.latestAssignment = $scope.game.lastIndexerAssignment();
    $scope.currentAssignment = $scope.game.currentAssignment();
    $scope.indexTime = $scope.game.assignmentTimeRemaining();
    $scope.uploaderTeam = $scope.game.uploaderTeamId ? teams.get($scope.game.uploaderTeamId) : null;

    let uploadedDate = new Date($scope.game.createdAt);
    $scope.uploadDate = (uploadedDate.getMonth() + 1) + '/' + uploadedDate.getDate() + '/' + uploadedDate.getFullYear();

    $scope.displayCurrentAssignment = function displayCurrentAssignment() {
        /* show current assignment in the following status */
        let index = [GAME_STATUSES.READY_FOR_INDEXING.id,
            GAME_STATUSES.INDEXING.id,
            GAME_STATUSES.READY_FOR_QA.id,
            GAME_STATUSES.QAING.id].indexOf($scope.game.status);
        return (index > -1 && !$scope.game.isAssignmentCompleted()) ? true : false;
    };

    $scope.displayDeliverTime = function displayDeliverTime() {
        /* do not show deliver time in the following status */
        let index = [GAME_STATUSES.NOT_INDEXED.id, GAME_STATUSES.FINALIZED.id, null].indexOf($scope.game.status);
        return (index > -1) ? false : true;
    };

    if ($scope.displayDeliverTime()) {
        $scope.deliverTime = $scope.game.timeRemaining();
    }

    $scope.setAside = function setAside() {
        const roleId = session.getCurrentRoleId();
        const userId = session.getCurrentUserId();
        const modalInstance = basicModal.openForConfirm({
            title: 'Set aside this Game?',
            bodyText: 'Are you sure you want to set aside this game?'
        });

        modalInstance.result.then(function setAside() {
            $scope.game.setAside();
            $scope.game.save().then(
                users.resendEmail(EMAIL_REQUEST_TYPES.SET_ASIDE_EMAIL, {roleType: roleId, gameId: gameId}, userId)
            ).then($scope.reload());
        });
    };

    $scope.assignIndexer = function assignIndexer() {
        let isQA = ($scope.game.canBeAssignedToQa() || $scope.game.canBeReassignedToQa());
        if ($scope.game.canBeReassignedToIndexer() || $scope.game.canBeReassignedToQa()) {
            $scope.game.unassign();
        }
        SelectIndexerModal.open($scope.game, isQA).result.finally(function reload(){
            $scope.reload();
        });
    };

    $scope.revertToIndexer = function revertToIndexer() {
        $scope.game.revertToLastIndexer();
        $scope.game.save().then($scope.reload());
    };

    $scope.revertToIndexing = function revertToIndexing() {
        RevertGameStatusModal.open($scope.game, GAME_STATUSES.READY_FOR_INDEXING).result.then(function reload(){
            $scope.reload();
        });
    };

    $scope.reload = function reload(){
        $state.transitionTo($state.current, {id: gameId}, { reload: true, inherit: true, notify: true });
    };
}

export default AdminGameInfoGameSidebarController;
