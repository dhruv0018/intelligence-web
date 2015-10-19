/**
 * Revert to indexind Modal controller class
 * @class RevertToIndexing
 */

RevertToIndexingContoller.$inject = [
    '$scope',
    '$modalInstance',
    'Game',
    'GAME_STATUSES'
];

function RevertToIndexingContoller (
    $scope,
    $modalInstance,
    game,
    GAME_STATUSES
) {

    $scope.revertToIndexing = function() {
        game.status = GAME_STATUSES.READY_FOR_INDEXING.id;
        game.save();
        $modalInstance.close();
        if ($scope.adminManagementModal) {
            $scope.adminManagementModal.close();
        }
    };
}

export default RevertToIndexingContoller;
