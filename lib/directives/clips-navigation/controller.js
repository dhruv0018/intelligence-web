/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* ClipsNavigationController dependencies
*/
ClipsNavigationController.$inject = [
    '$scope',
    'PlaysManager',
    'VideoPlayer'
];

/**
 * ClipsNavigationController controller.
 * @module ClipsNavigationController
 * @name ClipsNavigationController.controller
 * @type {controller}
 */
function ClipsNavigationController (
    $scope,
    playsManager,
    videoPlayer
) {

    console.log($scope.currentPlay);

    $scope.goToPlay = function goToPlay(play) {
        $scope.currentPlay = play;

        // Replace video sources
        $scope.sources = $scope.currentPlay.getVideoSources();
        videoPlayer.changeSource($scope.sources);

        // Change clip index to reflect current play
        $scope.clipIndex = playsManager.getIndex($scope.currentPlay) + 1;
    };
}

export default ClipsNavigationController;
