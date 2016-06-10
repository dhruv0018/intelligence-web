/* Fetch angular from the browser scope */
const angular = window.angular;

GamesSelfEditorController.$inject = [
    '$scope',
    'SessionService',
    '$stateParams',
    'GamesFactory',
    'ROLES'
];

function GamesSelfEditorController (
    $scope,
    session,
    $stateParams,
    games,
    ROLES
) {
    $scope.hideHeaders = false;
    $scope.hideEditingOptions = false;
    $scope.game = games.get($stateParams.id);

    let currentUser = session.getCurrentUser();
    let isAthlete = currentUser.is(ROLES.ATHLETE);

    if (isAthlete) {
        $scope.hideEditingOptions = true;
    }

    $scope.$watch('hideHeaders', () => {
        $scope.$emit('toggleHeaderDisplay', $scope.hideHeaders);
    });
}

export default GamesSelfEditorController;
