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
    'SessionService'
];

function VideoPlayerController (
    DEVICE,
    $rootScope,
    $scope,
    videoPlayer,
    videoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS,
    ROLES,
    session
) {
    let currentUser = session.getCurrentUser();
    $scope.userIsIndexer = currentUser.is(ROLES.INDEXER);

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

    Mousetrap.bind('space', onSpace);

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

    /**
     * Change handler for video player fill screen changes.
     */
    function onFullScreenChange (isFullScreen) {

        let parentElement;

        //Get the indexing block element
        let indexingElement = document.getElementsByClassName('indexing-block')[0];

        //Depending on full screen or not, find the element to prepend to
        parentElement = (isFullScreen) ? document.querySelector('videogular') :
                                        document.getElementsByClassName('content-full')[0];

        //Prepend indexing block into parent element
        parentElement.insertBefore( indexingElement, parentElement.firstChild );

        //Toggle fullscreen class
        if(indexingElement){
            indexingElement.classList.toggle('fullscreen', isFullScreen);
        }
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
