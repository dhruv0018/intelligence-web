const angular = window.angular;

/**
 * Admin Management controller class
 * @class AdminManagement
 */

AdminManagementController.$inject = [
    '$scope',
    '$state',
    '$modalInstance',
    'Game',
    'GAME_STATUSES',
    'UsersFactory',
    'DeleteGame.Modal',
    'SelectIndexer.Modal',
    'EMAIL_REQUEST_TYPES',
    'SessionService',
    'CopyGame.Modal',
    'RevertGameStatus.Modal'
];

function AdminManagementController (
    $scope,
    $state,
    $modalInstance,
    game,
    GAME_STATUSES,
    users,
    DeleteGameModal,
    SelectIndexerModal,
    EMAIL_REQUEST_TYPES,
    session,
    CopyGameModal,
    RevertGameStatusModal
) {
    $scope.GAME_STATUSES = GAME_STATUSES;
    $scope.game = game;

    //breaks the reference to the assignment on purpose
    //otherwise date is updated every increment which leads to dramatic amounts of extra time
    $scope.assignment = angular.copy(game.currentAssignment());

    $scope.management = {
        extendedDeadline: {}
    };

    $scope.extendIndexerDeadline = function() {
        var currentAssignment = $scope.game.currentAssignment();
        currentAssignment.deadline = $scope.management.extendedDeadline;
        $scope.game.save().then(function() {
            $modalInstance.close();
        });
    };

    if ($scope.assignment) {
        $scope.currentIndexer = users.get($scope.assignment.userId);
    }

    $scope.adminManagementModal = $modalInstance;
    DeleteGameModal.setScope($scope);

    $scope.revertToIndexing = function() {
        RevertGameStatusModal.open(game, GAME_STATUSES.READY_FOR_INDEXING).result.finally(function() {
            $modalInstance.close();
        });
    };

    $scope.reassignIndexer = function() {
        game.unassign();
        SelectIndexerModal.open(game, false).result.finally(function() {
            $modalInstance.close();
        });
    };

    $scope.reassignQAer = function() {
        game.unassign();
        SelectIndexerModal.open(game, true).result.finally(function() {
            $modalInstance.close();
        });
    };

    $scope.save = function() {

        const roleTypeId = session.getCurrentRoleTypeId();
        const gameId = game.id;
        const userId = session.getCurrentUserId();

        $scope.game.setAside();
        $scope.game.save();
        users.resendEmail(EMAIL_REQUEST_TYPES.SET_ASIDE_EMAIL, {roleType: roleTypeId, gameId: gameId}, userId);
        $modalInstance.close();
    };
}

export default AdminManagementController;
