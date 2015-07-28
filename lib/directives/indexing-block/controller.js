// import uiEventEmitter from '../../../src/emitters/ui-event';
// import EVENT from '../../../src/constants/event';

IndexerBlockController.$inject = [
    '$scope',
    'VideoPlayer',
    'IndexingService',
    'UIEventEmitter',
    'EVENT'
];

function IndexerBlockController(
    $scope,
    videoPlayer,
    indexing,
    uiEventEmitter,
    EVENT
) {

    //Watch for fullscreen change
    $scope.$watch(videoPlayerFullScreenWatch.bind(this));

    /**
     * Watch for video player full screen changes.
     */
    function videoPlayerFullScreenWatch () {

        $scope.fullScreenEnabled = videoPlayer.isFullScreen || document.fullscreenEnabled;
    }

    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, event => indexing.index());
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ESC, event => indexing.back());
}

export default IndexerBlockController;
