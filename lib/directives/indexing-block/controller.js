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

    $scope.backwards = () => indexing.back();
    $scope.forwards = () => indexing.index();

    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ESC, event => {

        if (!indexing.showScript) {

            $scope.backwards();
        }
    });

    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, event => {

        if (indexing.showScript && indexing.savable()) {

            document.getElementById('indexing-btn-save').focus();
        }
        else if (indexing.showScript && indexing.nextable()) {

            document.getElementById('indexing-btn-next').focus();
        }
        else {

            $scope.forwards();
        }
    });
}

export default IndexerBlockController;
