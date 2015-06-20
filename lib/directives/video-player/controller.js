module.exports = VideoPlayerController;

VideoPlayerController.$inject = [
    'DEVICE',
    '$rootScope',
    '$scope',
    'VideoPlayer',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS',
    'ROLES',
    'SessionService',
    'DetectDeviceService',
    '$timeout',
    'VG_STATES',
    'VIDEO_PLAYER_CONFIG'
];

function VideoPlayerController (
    DEVICE,
    $rootScope,
    $scope,
    videoPlayer,
    videoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS,
    ROLES,
    session,
    device,
    $timeout,
    VG_STATES,
    VIDEO_PLAYER_CONFIG
) {
    let currentUser = session.getCurrentUser();
    $scope.userIsIndexer = currentUser.is(ROLES.INDEXER);

    $scope.deviceIsiPhone = device.iPhone();

    if ($scope.deviceIsiPhone) {

        VIDEO_PLAYER_CONFIG.CONTROLS_HEIGHT = 0;
    }

    var mediaElement;
    var videogularElement;

    this.volume = 1;
    this.state = null;

    this.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

    this.config = {
        loop: false,
        autoplay: false,
        playsInline: false,
        preload: 'preload'
    };

    this.onPlayerReady = onPlayerReady;
    this.onUpdateState = onUpdateState;
    this.onChangeSource = onChangeSource;
    this.onUpdateVolume = onUpdateVolume;
    this.onCompleteVideo = onCompleteVideo;

    var removeVideoPlayerFullScreenWatch = $scope.$watch(videoPlayerFullScreenWatch.bind(this), onFullScreenChange);

    $scope.$on('$destroy', onDestroy);

    /**
     * Watch for video player full screen changes.
     */
    function videoPlayerFullScreenWatch () {

        this.fullScreenEnabled = videoPlayer.isFullScreen || document.fullscreenEnabled;

        return this.fullScreenEnabled;
    }

    function onPlayerReady (API) {

        angular.extend(videoPlayer, API);

        mediaElement = videoPlayer.mediaElement[0];
        videogularElement = videoPlayer.videogularElement[0];

        mediaElement.addEventListener('canplay', onCanPlay.bind(this));
        mediaElement.addEventListener('play', onPlay);
        mediaElement.addEventListener('pause', onPause);
        mediaElement.addEventListener('seeking', onSeeking);
        mediaElement.addEventListener('timeupdate', onTimeUpdate);
    }

    function onUpdateState (state) {

        this.state = state;
    }

    function onChangeSource (source) {

        this.canPlay = false;
        this.sources = source;
    }

    function onUpdateVolume (volume) {

        this.volume = volume;
    }

    function onCanPlay (event) {

        this.canPlay = true;

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, event);
    }

    function onPlay (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_PLAY, event);
        /* FIXME: This is temporary. On play/pause, Videogular actually runs
         * setState internally. From the Videogular source:
         *
         * this.play = function () {
         *     this.mediaElement[0].play();
         *     this.setState(VG_STATES.PLAY);
         * };
         *
         * this.pause = function () {
         *     this.mediaElement[0].pause();
         *     this.setState(VG_STATES.PAUSE);
         * };
         *
         * But, we need the trigger a digest cycle to get the currentState
         * property to update on the videoPlayer object on the playlist's scope.
         */

        $timeout(() => videoPlayer.setState(VG_STATES.PLAY));
    }

    function onPause (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_PAUSE, event);

        /* FIXME: See comment above in onPlay for reasoning */
        $timeout(() => videoPlayer.setState(VG_STATES.PAUSE));
    }

    function onSeeking (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_SEEKING, event);
    }

    function onTimeUpdate (event) {

        videoPlayer.currentTime = event.target.currentTime;
        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, event);
    }

    function onCompleteVideo (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, event);
    }

    /**
     * Change handler for video player fill screen changes.
     */
    function onFullScreenChange (isFullScreen) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.FULLSCREEN, {isFullScreen: isFullScreen});
    }

    function onDestroy () {

        removeVideoPlayerFullScreenWatch();

        if (mediaElement) {

            mediaElement.removeEventListener('canplay', onCanPlay);
            mediaElement.removeEventListener('play', onPlay);
            mediaElement.removeEventListener('pause', onPause);
            mediaElement.removeEventListener('seeking', onSeeking);
            mediaElement.removeEventListener('timeupdate', onTimeUpdate);
        }
    }
}
