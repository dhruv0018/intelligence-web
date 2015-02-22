module.exports = VideoPlayerController;

VideoPlayerController.$inject = ['DEVICE', '$rootScope', 'VideoPlayer', 'EventEmitter'];

function VideoPlayerController (DEVICE, $rootScope, videoPlayer, emitter) {

    this.volume = 1;
    this.state = null;

    this.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

    this.config = {
        autohide: true,
        autoplay: false
    };

    this.onPlayerReady = function(API) {

        angular.extend(videoPlayer, API);

        var mediaElement = videoPlayer.mediaElement[0];

        mediaElement.addEventListener('canplay', onCanPlay);
        mediaElement.addEventListener('play', onPlay);
        mediaElement.addEventListener('pause', onPause);
        mediaElement.addEventListener('seeking', onSeeking);
        mediaElement.addEventListener('timeupdate', onTimeUpdate);

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
    };

    this.onCompleteVideo = function() {

        emitter.register(new Event('clip-completion'));
    };

    this.onUpdateState = function(state) {

        this.state = state;
    };

    this.onChangeSource = function(source) {

        this.sources = source;
    };

    this.onUpdateVolume = function(volume) {

        this.volume = volume;
    };
}

