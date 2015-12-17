/* Fetch angular from the browser scope */
const angular = window.angular;

GamesSelfEditorController.$inject = [
    '$scope',
    '$stateParams',
    'GamesFactory'
];

function GamesSelfEditorController (
    $scope,
    $stateParams,
    games
) {
    $scope.hideHeaders = false;
    $scope.game = games.get($stateParams.id);

    $scope.$watch('hideHeaders', () => {
        $scope.$emit('toggleHeaderDisplay', $scope.hideHeaders);
    });
}

export default GamesSelfEditorController;
