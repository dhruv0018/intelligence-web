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

    let gameId = $stateParams.id;
    $scope.game = games.get(gameId);
    $scope.filteredPlaysIds = [];

    $scope.posterImage = {
        url: $scope.game.video.thumbnail
    };
}

export default GamesSelfEditorController;
