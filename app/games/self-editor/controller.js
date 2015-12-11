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
    $scope.isSelfEditing = false;
    $scope.game = games.get($stateParams.id);

    $scope.$watch('isSelfEditing', () => {
        $scope.$emit('toggleHeaderDisplay', $scope.isSelfEditing);
    });
}

export default GamesSelfEditorController;
