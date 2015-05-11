/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

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
    vgFullscreen
) {

    let self = this;

    let currentUser = session.getCurrentUser();
    $scope.userIsIndexer = currentUser.is(ROLES.INDEXER);

    var mediaElement;
    var videogularElement;

    self.volume = 1;
    self.state = null;

    self.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

    self.config = {
        loop: false,
        autoplay: false,
        playsInline: false,
        preload: 'preload'
    };

    self.onPlayerReady = onPlayerReady;
    self.onUpdateState = onUpdateState;
    self.onChangeSource = onChangeSource;
    self.onUpdateVolume = onUpdateVolume;
    self.onCompleteVideo = onCompleteVideo;

    Mousetrap.bind('space', onSpace);

    $scope.$on('$destroy', onDestroy);

    document.addEventListener(vgFullscreen.onchange, onFullScreenChange);

    function onPlayerReady (API) {

        angular.extend(videoPlayer, API);

        mediaElement = videoPlayer.mediaElement[0];
        videogularElement = videoPlayer.videogularElement[0];

        mediaElement.addEventListener('canplay', onCanPlay.bind(self));
        mediaElement.addEventListener('play', onPlay);
        mediaElement.addEventListener('pause', onPause);
        mediaElement.addEventListener('seeking', onSeeking);
        mediaElement.addEventListener('timeupdate', onTimeUpdate);

        /* Subscribe to external events */
        // TODO: have dependencies call play directly using the VideoPlayer service.
        videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.PLAY, playPlayer);
    }

    function onUpdateState (state) {

        self.state = state;
    }

    function onChangeSource (source) {

        self.canPlay = false;
        self.sources = source;
    }

    function onUpdateVolume (volume) {

        self.volume = volume;
    }

    function onCanPlay (event) {

        self.canPlay = true;

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, event);
    }

    function onPlay (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_PLAY, event);
    }

    function onPause (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_PAUSE, event);
    }

    function onSeeking (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_SEEKING, event);
    }

    function onSpace () {

        videoPlayer.playPause();

        return false;
    }

    function onTimeUpdate (event) {

        videoPlayer.currentTime = event.target.currentTime;
        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, event);
    }

    function onCompleteVideo (event) {

        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, event);
    }

    function playPlayer(event) {

        videoPlayer.play();
    }

    /**
     * Change handler for video player fill screen changes.
     */
    function onFullScreenChange () {

        // NOTE: adding to scope to add 'fullscreen' class to videogular element.
        // self should be handled by videogular controller, but it only adds the class for inline-elements
        self.fullScreenEnabled = vgFullscreen.isFullScreen();
        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.FULLSCREEN, {isFullScreen: vgFullscreen.isFullScreen()});
    }

    function onDestroy () {

        Mousetrap.unbind('space');

        removeVideoPlayerFullScreenWatch();
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
