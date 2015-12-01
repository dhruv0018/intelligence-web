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
}

export default GamesSelfEditorController;
