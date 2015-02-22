module.exports = VideoPlayerController;

VideoPlayerController.$inject = ['DEVICE', '$rootScope', 'VideoPlayer', 'EventEmitter'];

function VideoPlayerController (DEVICE, $rootScope, videoPlayer, emitter) {

    this.volume = 1;
    this.state = null;

    this.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

    this.config = {
        loop: false,
        autohide: true,
        autoplay: false,
        playsInline: false,
        preload: 'preload'
    };

    this.onPlayerReady = onPlayerReady;
    this.onUpdateState = onUpdateState;
    this.onChangeSource = onChangeSource;
    this.onUpdateVolume = onUpdateVolume;
    this.onCompleteVideo = onCompleteVideo;

    function onPlayerReady (API) {

        angular.extend(videoPlayer, API);

        var mediaElement = videoPlayer.mediaElement[0];

        mediaElement.addEventListener('canplay', onCanPlay);
        mediaElement.addEventListener('play', onPlay);
        mediaElement.addEventListener('pause', onPause);
        mediaElement.addEventListener('seeking', onSeeking);
        mediaElement.addEventListener('timeupdate', onTimeUpdate);
    }

    function onUpdateState (state) {

        this.state = state;
    }

    function onChangeSource(source) {

        this.sources = source;
    }

    function onUpdateVolume(volume) {

        this.volume = volume;
    }

    function onCanPlay(event) {

        emitter.register(event);
    }

    function onPlay(event) {

        emitter.register(event);
    }

    function onPause(event) {

        emitter.register(event);
    }

    function onSeeking(event) {

        emitter.register(event);
    }

    function onTimeUpdate(event) {

        emitter.register(event);
    }

    function onCompleteVideo () {

        emitter.register(new Event('clip-completion'));
    }
}

