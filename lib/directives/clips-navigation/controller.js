/* Fetch angular from the browser scope */
const angular = window.angular;

/*
* ClipsNavigationController dependencies
*/
ClipsNavigationController.$inject = [
    '$scope',
    'PlayManager',
    'PlaysManager',
    'VideoPlayer',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS'
];

/**
 * ClipsNavigationController controller.
 * @module ClipsNavigationController
 * @name ClipsNavigationController.controller
 * @type {controller}
 */
function ClipsNavigationController (
    $scope,
    playManager,
    playsManager,
    videoPlayer,
    VideoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS
) {
    /* Load the plays in the plays manager
     * TODO: accomplish this without playsManager
     */
    playsManager.reset($scope.plays);

    $scope.currentPlay = $scope.plays[0];
    $scope.previousPlay = playsManager.getPreviousPlay($scope.currentPlay);
    $scope.nextPlay = playsManager.getNextPlay($scope.currentPlay);
    $scope.sources = $scope.currentPlay.getVideoSources();
    $scope.clipTotal = $scope.plays.length;
    $scope.clipIndex = playsManager.getIndex($scope.currentPlay) + 1;

    $scope.goToPlay = function goToPlay(play) {
        $scope.currentPlay = play;
        $scope.previousPlay = playsManager.getPreviousPlay($scope.currentPlay);
        $scope.nextPlay = playsManager.getNextPlay($scope.currentPlay);

        // Replace video sources
        $scope.sources = $scope.currentPlay.getVideoSources();
        videoPlayer.changeSource($scope.sources);

        // Change clip index to reflect current play
        $scope.clipIndex = playsManager.getIndex($scope.currentPlay) + 1;
    };

    // When clip finishes playing, go to next play if continuous play is on
    VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);

    function onCompleteVideo() {
        /* Always play continuously */
        $scope.goToPlay($scope.nextPlay);

        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, function playVideo() {
            videoPlayer.play();
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, playVideo);
        });
    }
}

export default ClipsNavigationController;
