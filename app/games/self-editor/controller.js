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
    $scope.indexingMode = false;
    $scope.game = games.get($stateParams.id);

    $scope.$watch('indexingMode', () => {
        $scope.$emit('toggleHeaderDisplay', $scope.indexingMode);
    });
}

export default GamesSelfEditorController;
