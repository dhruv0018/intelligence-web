const angular = window.angular;

/**
 * Select Indexer controller class
 * @class SelectIndexer
 */

SelectIndexerController.$inject = [
    '$scope',
    '$state',
    '$modalInstance',
    'ROLE_TYPE',
    'ROLES',
    'UsersFactory',
    'Game',
    'TeamsFactory',
    'LABELS',
    'LABELS_IDS',
    'PRIORITIES',
    'PRIORITIES_IDS',
    'isQa'
];

function SelectIndexerController (
    $scope,
    $state,
    $modalInstance,
    ROLE_TYPE,
    ROLES,
    users,
    game,
    teams,
    LABELS,
    LABELS_IDS,
    PRIORITIES,
    PRIORITIES_IDS,
    isQa
) {
    $scope.LABELS_IDS = LABELS_IDS;
    $scope.LABELS = LABELS;
    $scope.PRIORITIES = PRIORITIES;
    $scope.PRIORITIES_IDS = PRIORITIES_IDS;
    $scope.ROLES = ROLES;
    $scope.ROLE_TYPE = ROLE_TYPE;
    $scope.users = users.getList();
    $scope.game = game;
    $scope.uploaderTeam = teams.get(game.uploaderTeamId);
    $scope.team = teams.get(game.teamId);
    $scope.opposingTeam = teams.get(game.opposingTeamId);
    $scope.isQa = isQa;

    $scope.selectionData = {
        modifiedDeadline: {}
    };

    $scope.assignToIndexer = function(indexerId, deadline) {
        $scope.game.assignToIndexer(indexerId, deadline);
        $scope.game.updateLocalResourceOnPUT = true;
        $scope.game.save();
        $modalInstance.close();
    };

    $scope.assignToQa = function(indexerId, deadline) {

        $scope.game.assignToQa(indexerId, deadline);
        $scope.game.save();
        $scope.game.updateLocalResourceOnPUT = true;
        $modalInstance.close();
    };
}

export default SelectIndexerController;
