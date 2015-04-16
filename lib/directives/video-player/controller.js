/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

module.exports = VideoPlayerController;

VideoPlayerController.$inject = [
    'DEVICE',
    '$rootScope',
    '$scope',
    'VideoPlayer',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS'
];

function VideoPlayerController (
    DEVICE,
    $rootScope,
    $scope,
    videoPlayer,
    videoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS
) {

    var mediaElement;
    var videogularElement;

    this.volume = 1;
    this.state = null;

    this.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

    this.config = {
        loop: false,
        autoplay: false,
        playsInline: true,
        preload: 'preload'
    };

    this.onPlayerReady = onPlayerReady;
    this.onUpdateState = onUpdateState;
    this.onChangeSource = onChangeSource;
    this.onUpdateVolume = onUpdateVolume;
    this.onCompleteVideo = onCompleteVideo;

    Mousetrap.bind('space', onSpace);

    var removeVideoPlayerFullScreenWatch = $scope.$watch(videoPlayerFullScreenWatch, onFullScreenChange);

    $scope.$on('$destroy', onDestroy);

    /**
     * Watch for video player full screen changes.
     */
    function videoPlayerFullScreenWatch () {

        if (videogularElement) {

            return videogularElement.classList.contains('fullscreen');
        }
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

        /* Subscribe to external events */
        // TODO: have dependencies call play directly using the VideoPlayer service.
        videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.PLAY, playPlayer);
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

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY);
    }

    function onPlay (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_PLAY);
    }

    function onPause (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_PAUSE);
    }

    function onSeeking (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_SEEKING, {currentTime: event.target.currentTime});
    }

    function onSpace () {

        videoPlayer.playPause();

        return false;
    }

    function onTimeUpdate (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, {currentTime: event.target.currentTime});
    }

    function onCompleteVideo () {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE);
    }

    function playPlayer(event) {

        videoPlayer.play();
    }

    /**
     * Change handler for video player fill screen changes.
     */
    function onFullScreenChange (isFullScreen) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.FULLSCREEN, {isFullScreen: isFullScreen});
    }

    function onDestroy () {

        Mousetrap.unbind('space');

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
