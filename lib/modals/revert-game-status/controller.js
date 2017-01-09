/**
 * Revert to indexind Modal controller class
 * @class RevertGameStatus
 */

RevertGameStatusController.$inject = [
    '$scope',
    '$uibModalInstance',
    'Game',
    'RevertToStatus',
    'SessionService',
    'GAME_STATUS_IDS',
    'GAME_STATUSES',
    'EMAIL_REQUEST_TYPES'
];

function RevertGameStatusController (
    $scope,
    $uibModalInstance,
    game,
    revertToStatus,
    session,
    GAME_STATUS_IDS,
    GAME_STATUSES,
    EMAIL_REQUEST_TYPES
) {

    let user = session.getCurrentUser();
    $scope.revertToStatus  = revertToStatus;
    $scope.GAME_STATUS_IDS = GAME_STATUS_IDS;
    $scope.GAME_STATUSES   = GAME_STATUSES;

    $scope.revertGameStatus = function() {
        game.status = revertToStatus.id;
        game.save();
        if (revertToStatus.id === GAME_STATUSES.READY_FOR_INDEXING.id) {
            user.resendEmail(EMAIL_REQUEST_TYPES.REVERT_TO_INDEXING, {gameId: game.id});
        }
        $uibModalInstance.close();
    };

}

export default RevertGameStatusController;
