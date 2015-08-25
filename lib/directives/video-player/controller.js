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
    'VIDEO_PLAYER_CONFIG',
    'vgFullscreen'
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
    VIDEO_PLAYER_CONFIG,
    vgFullscreen
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

    /* Set initial sources */
    if (this.video) {
        this.sources = [this.video.resourceUrls[0]];
    }

    this.config = {
        loop: false,
        autoplay: false,
        playsInline: false,
        preload: 'preload'
    };

    let onPlayerReady = (API) => {

        angular.extend(videoPlayer, API);

        mediaElement = videoPlayer.mediaElement[0];
        videogularElement = videoPlayer.videogularElement[0];

        document.addEventListener(vgFullscreen.onchange, onFullScreenChange);
        Mousetrap.bind('space', onSpace);
        mediaElement.addEventListener('canplay', onCanPlay);
        mediaElement.addEventListener('play', onPlay);
        mediaElement.addEventListener('pause', onPause);
        mediaElement.addEventListener('seeking', onSeeking);
        mediaElement.addEventListener('timeupdate', onTimeUpdate);

        /* Subscribe to external events */
        // TODO: have dependencies call play directly using the VideoPlayer service.
        videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.PLAY, playPlayer);
    };

    let onUpdateState = (state) => {

        this.state = state;
    };

    let onChangeSource = (source) => {

        mediaElement.currentTime = videoPlayer.currentTime;
        this.canPlay = false;
    };

    let onUpdateVolume = (volume) => {

        this.volume = volume;
    };

    let onCanPlay = (event) => {

        this.canPlay = true;

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, event);
    };

    let onPlay = (event) => {

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
    };

    let onPause = (event) => {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_PAUSE, event);

        /* FIXME: See comment above in onPlay for reasoning */
        $timeout(() => videoPlayer.setState(VG_STATES.PAUSE));
    };

    let onSeeking = (event) => {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_SEEKING, event);
    };

    let onSpace = () => {

        videoPlayer.playPause();

        return false;
    };

    let onTimeUpdate = (event) => {

        videoPlayer.currentTime = event.target.currentTime;
        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, event);
    };

    let onCompleteVideo = (event) => {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, event);
    };

    let playPlayer = (event) => {

        videoPlayer.play();
    };

    let onFullScreenChange = () => {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.FULLSCREEN, {isFullScreen: vgFullscreen.isFullScreen()});
    };

    this.onPlayerReady = onPlayerReady;
    this.onUpdateState = onUpdateState;
    this.onChangeSource = onChangeSource;
    this.onUpdateVolume = onUpdateVolume;
    this.onCompleteVideo = onCompleteVideo;

    $scope.$on('$destroy', onDestroy);

    videoPlayer.setVideo = (video) => {

        if (!video) {
            console.error('videoPlayer.setVideo requires \'video\' parameter');
            return;
        }

        videoPlayer.stop();

        this.video = video;
        this.sources = [videoPlayer.selectedMediaSrc.getSelectedOrBestSource(video)];
    };

    function onDestroy () {

        Mousetrap.unbind('space');
        document.removeEventListener(vgFullscreen.onchange, onFullScreenChange);

        if (mediaElement) {

            mediaElement.removeEventListener('canplay', onCanPlay);
            mediaElement.removeEventListener('play', onPlay);
            mediaElement.removeEventListener('pause', onPause);
            mediaElement.removeEventListener('seeking', onSeeking);
            mediaElement.removeEventListener('timeupdate', onTimeUpdate);
        }
    }
}
