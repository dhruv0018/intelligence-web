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

    $scope.$on('$destroy', onDestroy);

    /**
     * Watch for video player full screen changes.
     */
    function videoPlayerFullScreenWatch () {

        $scope.fullScreenEnabled = videoPlayer.isFullScreen || document.fullscreenEnabled;
    }

    // TODO: Wrap this methods in the $apply()
    $scope.backwards = () => {

        indexing.back();
        $scope.$apply();
    };

    // TODO: Wrap this methods in the $apply()
    $scope.forwards = () => {

        indexing.index();
        $scope.$apply();
    };

    // Add keybinding handlers for ENTER, ESC
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ESC, onEsc);
    uiEventEmitter.on(EVENT.UI.KEY_DOWN.ENTER, onEnter);

    function onEsc (event) {

        if (!indexing.showScript) {

            $scope.backwards();
        }
    }

    function onEnter (event) {

        if (indexing.showScript && indexing.savable()) {

            // TODO: Directivize this. <indexing-save-button>
            /* The timeout ensures the focus gets applied. */
            setTimeout(() => document.getElementById('indexing-btn-save').focus(), 0);
        }
        else if (indexing.showScript && indexing.nextable()) {

            // TODO: Directivize this. <indexing-next-button>
            /* The timeout ensures the focus gets applied. */
            setTimeout(() => document.getElementById('indexing-btn-next').focus(), 0);
        }
        else {

            $scope.forwards();
        }
    }

    function onDestroy () {

        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ESC, onEsc);
        uiEventEmitter.removeListener(EVENT.UI.KEY_DOWN.ENTER, onEnter);
    }
}

export default IndexerBlockController;
