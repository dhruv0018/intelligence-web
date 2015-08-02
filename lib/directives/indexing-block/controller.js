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

            // TODO: Figure out why this is necessary. Might be a browser thing.
            /* The timeout ensures the focus gets applied. */
            setTimeout(() => {

                let btnElem = document.getElementById('indexing-btn-save');
                /* Since this event handler gets called for all ENTER events,
                 * make sure we still have a button to focus. */
                if (btnElem) {

                    btnElem.focus();
                }
            }, 0);
        }
        else if (indexing.showScript && indexing.nextable()) {

            // TODO: Figure out why this is necessary. Might be a browser thing.
            /* The timeout ensures the focus gets applied. */
            setTimeout(() => {

                let btnElem = document.getElementById('indexing-btn-next');
                /* Since this event handler gets called for all ENTER events,
                 * make sure we still have a button to focus. */
                if (btnElem) {

                    btnElem.focus();
                }
            }, 0);
        }
        else {

            $scope.forwards();
        }
    });
}

export default IndexerBlockController;
