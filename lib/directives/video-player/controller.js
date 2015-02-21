module.exports = VideoPlayerController;

VideoPlayerController.$inject = ['$rootScope', '$scope', 'VideoPlayer', 'EventEmitter', 'DEVICE'];

function VideoPlayerController($rootScope, $scope, videoPlayer, emitter, DEVICE) {

    $scope.volume = 1;
    $scope.state = null;

    $scope.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

    $scope.config = {
        autohide: true,
        autoplay: false
    };

    $scope.onPlayerReady = function(API) {

        angular.extend(videoPlayer, API);

        videoPlayer.mediaElement[0].addEventListener('canplay', onCanPlay);
        videoPlayer.mediaElement[0].addEventListener('play', onPlay);
        videoPlayer.mediaElement[0].addEventListener('pause', onPause);
        videoPlayer.mediaElement[0].addEventListener('seeking', onSeeking);
        videoPlayer.mediaElement[0].addEventListener('timeupdate', onTimeUpdate);

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

    $scope.onCompleteVideo = function() {

        emitter.register(new Event('clip-completion'));
    };

    $scope.onUpdateState = function(state) {

        $scope.state = state;
    };

    $scope.onChangeSource = function(source) {

        $scope.sources = source;
    };

    $scope.onUpdateVolume = function(volume) {

        $scope.volume = volume;
    };
}

