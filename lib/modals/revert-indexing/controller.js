/**
 * Revert to indexind Modal controller class
 * @class RevertToIndexing
 */

RevertToIndexingContoller.$inject = [
    '$scope',
    '$modalInstance',
    'Game',
    'SessionService',
    'GAME_STATUSES',
    'EMAIL_REQUEST_TYPES'
];

function RevertToIndexingContoller (
    $scope,
    $modalInstance,
    game,
    session,
    GAME_STATUSES,
    EMAIL_REQUEST_TYPES
) {

    let user = session.getCurrentUser();

    $scope.closeModal = function() {
        $modalInstance.close();
        if ($scope.adminManagementModal) {
            $scope.adminManagementModal.close();
        }
    };

    $scope.revertToIndexing = function() {
        game.status = GAME_STATUSES.READY_FOR_INDEXING.id;
        game.save();
        user.resendEmail(EMAIL_REQUEST_TYPES.REVERT_TO_INDEXING, {gameId: game.id});
        $scope.closeModal();
    };

}

export default RevertToIndexingContoller;
