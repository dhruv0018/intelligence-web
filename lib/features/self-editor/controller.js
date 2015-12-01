SelfEditorController.$inject = [
    '$scope'
];

function SelfEditorController (
    $scope
) {
    $scope.video = $scope.game.video;
    $scope.posterImage = {
        url: $scope.game.video.thumbnail
    };
}

export default SelfEditorController;
