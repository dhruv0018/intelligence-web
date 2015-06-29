/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

IndexerBlockController.$inject = [
    '$scope',
    'VideoPlayer',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS'
];

function IndexerBlockController(
    $scope,
    videoPlayer,
    videoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS
) {

    //Watch for fullscreen change
    $scope.$watch(videoPlayerFullScreenWatch.bind(this), onFullScreenChange);

    /**
     * Watch for video player full screen changes.
     */
    function videoPlayerFullScreenWatch () {

        $scope.fullScreenEnabled = videoPlayer.isFullScreen || document.fullscreenEnabled;
    }

    /**
     * Change handler for video player fill screen changes.
     */
    function onFullScreenChange (isFullScreen) {
        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.FULLSCREEN, {isFullScreen: isFullScreen});
    }

}

export default IndexerBlockController;
