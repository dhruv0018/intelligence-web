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

    $scope.backwards = () => {

        indexing.back();
        $scope.$apply();
    };
    $scope.forwards = () => {

        indexing.index();
        $scope.$apply();
    };

    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ESC, event => {

        if (!indexing.showScript) {

            $scope.backwards();
        }
    });

    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, event => {

        if (indexing.showScript && indexing.savable()) {

            // FIXME: Why doesn't this element focus when not in timeout
            window.setTimeout(
                () => document.getElementById('indexing-btn-save').focus(),
                0
            );
        }
        else if (indexing.showScript && indexing.nextable()) {

            // FIXME: Why doesn't this element focus when not in timeout
            window.setTimeout(
                () => document.getElementById('indexing-btn-next').focus(),
                0
            );
        }
        else {

            $scope.forwards();
        }
    });
}

export default IndexerBlockController;
