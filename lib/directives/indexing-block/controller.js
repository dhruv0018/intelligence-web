/* Fetch angular from the browser scope */
const angular = window.angular;
const moment = require('moment');

IndexerBlockController.$inject = [
    '$scope',
    'VideoPlayer'
];

function IndexerBlockController(
    $scope,
    videoPlayer
) {

    //Watch for fullscreen change
    $scope.$watch(videoPlayerFullScreenWatch.bind(this));

    /**
     * Watch for video player full screen changes.
     */
    function videoPlayerFullScreenWatch () {

        $scope.fullScreenEnabled = videoPlayer.isFullScreen || document.fullscreenEnabled;
    }

}

export default IndexerBlockController;
