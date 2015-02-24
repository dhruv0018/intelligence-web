/* Fetch Mousetrap from the browser scope */
var Mousetrap = window.Mousetrap;

module.exports = VideoPlayerController;

VideoPlayerController.$inject = ['DEVICE', '$rootScope', '$scope', 'VideoPlayer', 'EventEmitter'];

function VideoPlayerController (DEVICE, $rootScope, $scope, videoPlayer, emitter) {

    var mediaElement;

    this.volume = 1;
    this.state = null;

    this.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

    this.config = {
        loop: false,
        autohide: true,
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

    $scope.$on('$destroy', onDestroy);

    function onPlayerReady (API) {

        angular.extend(videoPlayer, API);

        mediaElement = videoPlayer.mediaElement[0];

        mediaElement.addEventListener('canplay', onCanPlay);
        mediaElement.addEventListener('play', onPlay);
        mediaElement.addEventListener('pause', onPause);
        mediaElement.addEventListener('seeking', onSeeking);
        mediaElement.addEventListener('timeupdate', onTimeUpdate);

        /* Subscribe to external events */
        emitter.subscribe('VIDEO_PAUSE_EMISSION', pausePlayer);
    }

    function onUpdateState (state) {

        this.state = state;
    }

    function onChangeSource (source) {

        this.sources = source;
    }

    function onUpdateVolume (volume) {

        this.volume = volume;
    }

    function onCanPlay (event) {

        emitter.register(event);
    }

    function onPlay (event) {

        emitter.register(event);
    }

    function onPause (event) {

        emitter.register(event);
    }

    function onSeeking (event) {

        emitter.register(event);
    }

    function onSpace () {

        videoPlayer.playPause();

        return false;
    }

    function onTimeUpdate (event) {

        emitter.register(event);
    }

    function onCompleteVideo () {

        emitter.register(new Event('clip-completion'));
    }

    function pausePlayer(event) {

        videoPlayer.pause();
    }

    function onDestroy () {

        Mousetrap.unbind('space');

        if (mediaElement) {

            mediaElement.removeEventListener('canplay', onCanPlay);
            mediaElement.removeEventListener('play', onPlay);
            mediaElement.removeEventListener('pause', onPause);
            mediaElement.removeEventListener('seeking', onSeeking);
            mediaElement.removeEventListener('timeupdate', onTimeUpdate);
        }
    }
}

