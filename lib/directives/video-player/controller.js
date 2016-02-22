module.exports = VideoPlayerController;

VideoPlayerController.$inject = [
    'DEVICE',
    '$q',
    '$rootScope',
    '$scope',
    '$element',
    'VideoPlayer',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS',
    'ROLES',
    'SessionService',
    'DetectDeviceService',
    '$timeout',
    'VG_STATES',
    'VIDEO_PLAYER_CONFIG',
    '$sce'
];

function VideoPlayerController (
    DEVICE,
    $q,
    $rootScope,
    $scope,
    $element,
    videoPlayer,
    videoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS,
    ROLES,
    session,
    device,
    $timeout,
    VG_STATES,
    VIDEO_PLAYER_CONFIG,
    $sce
) {

    let currentVideo = this.video;

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
    this.fullscreenEnabled = document.fullscreenEnabled;
    this.fullscreenElement = document.fullscreenElement;

    this.isMobile = ($rootScope.DEVICE === DEVICE.MOBILE);

    /* Set initial sources */
    if (this.video) {

        let nonTrustedVideogularSourceObject = this.video.resourceUrls[0];
        setSafeVideoSources.call(this, nonTrustedVideogularSourceObject.src, nonTrustedVideogularSourceObject.type);
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
        this.videogularElement = videogularElement;
        this.videogularElement.oncontextmenu = function() {
            return false;
        };

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

    let onFullscreenChange = () => {

        if (document.fullscreenEnabled) {

            this.fullscreenEnabled = true;
            this.fullscreenElement = document.fullscreenElement;

        } else {

            this.fullscreenEnabled = false;
            this.fullscreenElement = null;
        }

        // TODO: Remove this emitter and let listeners listen to document 'fullscreenchange' event instead
        let isVideoPlayerFullscreen = document.fullscreenEnabled && this.fullscreenElement === videogularElement;
        videoPlayerEventEmitter.emit(VIDEO_PLAYER_EVENTS.FULLSCREEN, {isFullScreen: isVideoPlayerFullscreen});
    };

    this.onPlayerReady = onPlayerReady;
    this.onUpdateState = onUpdateState;
    this.onChangeSource = onChangeSource;
    this.onUpdateVolume = onUpdateVolume;
    this.onCompleteVideo = onCompleteVideo;

    document.addEventListener('fullscreenchange', onFullscreenChange);
    $scope.$on('$destroy', onDestroy);

    /*
     * Sets up a new video by getting its best or currently selected source, returning a promise
     * @param {Video} video
     * @returns {promise} Resolves when the video is ready to play OR Reject if the video cannot be set
     */
    videoPlayer.setVideo = (video) => {

        let deferred = $q.defer();

        if (!video) {

            console.error(`missing required 'video' parameter`);
            deferred.reject();

        } else if (currentVideo === video) {

            deferred.resolve();

        } else {

            // FIXME: Can we avoid stopping the video to solve the problems below?
            // Temporary fix to keep the get the video-player to play again
            // if 'videoPlayer.play' is called after.
            // Also ensures that the pause/play button state update appropriately after
            videoPlayer.stop();

            // keep track of the current video
            currentVideo = video;

            // get the video-player sources
            let videoPlayerSrc = videoPlayer.selectedMediaSrc.getSelectedOrBestSource(video);
            // get the trusted src
            let trustedSrc = $sce.trustAsResourceUrl(videoPlayerSrc.src);
            // sets the video-players sources
            this.sources = [
                {
                    type: videoPlayerSrc.type,
                    src: trustedSrc
                }
            ];

            // Wait until the video canplay to resolve
            mediaElement.addEventListener('canplay', function onCanPlay() {

                mediaElement.removeEventListener('canplay', onCanPlay);
                deferred.resolve();
            });
        }

        return deferred.promise;
    };

    /*
     * Sets up a new video by getting its best or currently selected source, returning a promise
     * @param {Video} video
     * @returns {promise} Resolves when the video is ready to play OR Reject if the video cannot be set
     */
    videoPlayer.setVideoFragment = (video, start, end) => {

        let deferred = $q.defer();

        if (!video) {

            console.error(`missing required 'video' parameter`);
            deferred.reject();

        } else if (typeof start !== 'number') {

            console.error(`missing required 'start' parameter`);
            deferred.reject();

        } else if (typeof end !== 'number') {

            console.error(`missing required 'end' parameter`);
            deferred.reject();

        } else if (start > end) {

            console.error(`start must be less than end`);
            deferred.reject();

        } else {

            // FIXME: Can we avoid stopping the video to solve the problems below?
            // Temporary fix to keep the get the video-player to play again
            // if 'videoPlayer.play' is called after.
            // Also ensures that the pause/play button state update appropriately after
            videoPlayer.stop();

            // keep track of the current video
            currentVideo = video;

            // get the video-player sources
            let nonTrustedVideogularSourceObject = videoPlayer.selectedMediaSrc.getSelectedOrBestSource(video);
            // create the source time fragment
            let nonTrustedVideogularFragmentSource = `${nonTrustedVideogularSourceObject.src}#t=${start},${end}`;
            // sets the video-players sources
            setSafeVideoSources.call(this, nonTrustedVideogularFragmentSource, nonTrustedVideogularSourceObject.type);

            // Wait until the video canplay to resolve
            mediaElement.addEventListener('canplay', function onCanPlay() {

                mediaElement.removeEventListener('canplay', onCanPlay);
                deferred.resolve();
            });
        }

        return deferred.promise;
    };

    /* Sets the video's sources on the scope so that the video player
     * knows what to play. It ensures that the source provided is
     * a trusted src for security.
     */
    function setSafeVideoSources(source, mediaType) {

        // create a trusted video source
        let trustedSource = $sce.trustAsResourceUrl(source);
        // create a videogular source object
        let videogularSource = {
            type: mediaType,
            src: trustedSource
        };

        // set the videogular source in array for videogular to receive
        this.sources = [videogularSource];
    }

    function onDestroy () {

        Mousetrap.unbind('space');
        document.removeEventListener('fullscreenchange', onFullscreenChange);

        if (mediaElement) {

            mediaElement.removeEventListener('canplay', onCanPlay);
            mediaElement.removeEventListener('play', onPlay);
            mediaElement.removeEventListener('pause', onPause);
            mediaElement.removeEventListener('seeking', onSeeking);
            mediaElement.removeEventListener('timeupdate', onTimeUpdate);
        }
    }
}
