/* Fetch angular from the browser scope */
const angular = window.angular;

GamesSelfEditorController.$inject = [
    '$scope'
];

function GamesSelfEditorController (
    $scope
) {
    $scope.indexingMode = false;
}

export default GamesSelfEditorController;
