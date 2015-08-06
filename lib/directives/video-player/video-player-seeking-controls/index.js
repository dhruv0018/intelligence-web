/* Constants */
let TO           = '';
const ELEMENTS   = 'E';
const ATTRIBUTES = 'A';

/* Fetch Mousetrap from the browser scope */
const Mousetrap  = window.Mousetrap;

/* Fetch angular from the browser scope */
const angular    = window.angular;

/**
 * VideoPlayerSeekingControls module.
 * @module VideoPlayerSeekingControls
 */
let VideoPlayerSeekingControls = angular.module('VideoPlayerSeekingControls', []);

/**
 * videoPlayerSeekingControls dependencies
 */
videoPlayerSeekingControls.$inject = [
    'SEEKING_STATES'
];

/**
 * VideoPlayerSeekingControls directive.
 * @module VideoPlayerSeekingControls
 * @name VideoPlayerSeekingControls
 * @type {directive}
 */
function videoPlayerSeekingControls (
    SEEKING_STATES
) {

    const definition = {

        restrict: TO += ATTRIBUTES,

        require: ['^videogular', '^videoPlayer'],

        scope: true,

        bindToController: true,

        controller: VideoPlayerSeekingControlsController,

        controllerAs: 'videoPlayerSeekingControls',

        link: link

    };

    function link (scope, element, attributes, controller) {

        scope.SEEKING_STATES = SEEKING_STATES;
    }

    return definition;
}

VideoPlayerSeekingControlsController.$inject = [
    '$scope',
    '$element',
    'config',
    'VIDEO_PLAYER_EVENTS',
    'VideoPlayerEventEmitter',
    'SEEKING_STATES',
    'PLAYBACK_RESUME_STATES',
    'VG_STATES',
    'VideoPerformanceTimer'
];

function VideoPlayerSeekingControlsController (
    $scope,
    $element,
    config,
    VIDEO_PLAYER_EVENTS,
    VideoPlayerEventEmitter,
    SEEKING_STATES,
    PLAYBACK_RESUME_STATES,
    VG_STATES,
    VideoPerformanceTimer
) {

    let animationFrame;
    let stepStart       = null;
    let seekingState    = SEEKING_STATES.NOT_SEEKING;
    let resumePlayback  = PLAYBACK_RESUME_STATES.DEFAULT;
    let videogular      = $element.inheritedData('$videogularController');
    let videoPlayerController = $element.inheritedData('$videoPlayerController');
    let mediaElement    = videogular.mediaElement[0];
    let playPauseButton = $element.find('vg-play-pause-button')[0].firstChild;

    $scope.seekingState = SEEKING_STATES.NOT_SEEKING;
    videoPlayerController.playPauseButton = playPauseButton;

    $scope.$on('$destroy', onDestroy);

    Mousetrap.bind('space', onSpace);

    playPauseButton.addEventListener('click', onPlayPauseClick);

    const videoPerformanceTimer = VideoPerformanceTimer.getInstance(mediaElement);

    /**
     * Play/pause video when user hits space; cancels seeking.
     * @return undefined
     */

    function onSpace () {

        videogular.playPause();
        onPlayPauseClick();

        return false;
    }

    /**
     * Piggyback on play/pause button clicks to cancel seeking.
     * @return undefined
     */

    function onPlayPauseClick () {

        updateVideoPerformanceTimer();

        if (seekingState === SEEKING_STATES.NOT_SEEKING) return;

        resumePlayback = PLAYBACK_RESUME_STATES.DEFAULT;
        changeState(SEEKING_STATES.NOT_SEEKING);
    }

    /**
     * Starts or pause the videoPerformanceTimer manually.
     * Only call this method after the videogular.pause() or play() methods are invoked.
     */
    function updateVideoPerformanceTimer() {

        if (!mediaElement.paused) {

            // start timer
            videoPerformanceTimer.start();

        } else {

            videoPerformanceTimer.pause();
        }
    }

    /**
     * Start video playback. Saves current play state for playback resume
     * after seeking.
     * @return undefined
     */

    function startPlayback () {

        if (videogular.currentState !== VG_STATES.PLAY) {

            videogular.play();
            resumePlayback = PLAYBACK_RESUME_STATES.PAUSE;
        }
    }

    /**
     * Stop video playback. Saves current play state for playback resume
     * after seeking.
     * @return undefined
     */

    function pausePlayback() {

        if (videogular.currentState === VG_STATES.PLAY) {

            resumePlayback = PLAYBACK_RESUME_STATES.RESUME;
        }
        videogular.pause();
    }

    /**
     * Set up time and speed for backwards seek stepping.
     * Calls requestAnimationFrame.
     * after seeking.
     * @param {String} [speed=slow] - The stepping speed.
     * @return undefined
     */

    function startStepping (speed = 'slow') {

        stepStart      = undefined;
        animationFrame = requestAnimationFrame(step);
    }

    /**
     * Backward seeking step.
     * @param {Number} timestamp - Current stepping time.
     * @return undefined
     */

    function step (timestamp) {

        /* Determine last time step function was called (in seconds). */
        if (!stepStart) stepStart = timestamp;
        let timeSinceLastStep     = (timestamp - stepStart) / 1000;

        /* Seek video if time since last step is step time or greater */
        if (!mediaElement.seeking) {

            /* Multiply time since last step by playback rate */
            mediaElement.currentTime -= (timeSinceLastStep * mediaElement.playbackRate);
            stepStart = timestamp;
        }

        animationFrame = requestAnimationFrame(step);
    }

    /**
     * Remove event handlers.
     * @return undefined
     */

    function onDestroy () {

        playPauseButton.removeEventListener('click', onPlayPauseClick);
        Mousetrap.unbind('space');
    }

    /**
     * Get the current seeking state.
     * @return {Number} The current state constant value.
     */

    this.getCurrentState = function getCurrentState () {
        return seekingState;
    };

    /**
     * Change the seeking state. Cancel animation frame and reset playback rate.
     * @param {Number} newState - The new state.
     * @return undefined
     */

    function changeState (newState) {
        seekingState              = SEEKING_STATES.NOT_SEEKING;
        mediaElement.playbackRate = config.videoplayer.playbackRate.normal;
        cancelAnimationFrame(animationFrame);

        seekingState = $scope.seekingState = newState;

        switch (newState) {

            case SEEKING_STATES.FAST_BACKWARD:

                pausePlayback();
                mediaElement.playbackRate = config.videoplayer.playbackRate.fast;
                startStepping('fast');

                break;

            case SEEKING_STATES.SLOW_BACKWARD:

                pausePlayback();
                mediaElement.playbackRate = config.videoplayer.playbackRate.slow;
                startStepping('slow');

                break;

            case SEEKING_STATES.SLOW_FORWARD:

                startPlayback();
                mediaElement.playbackRate = config.videoplayer.playbackRate.slow;

                break;

            case SEEKING_STATES.FAST_FORWARD:

                startPlayback();
                mediaElement.playbackRate = config.videoplayer.playbackRate.fast;

                break;

            case SEEKING_STATES.NOT_SEEKING:

                if (resumePlayback === PLAYBACK_RESUME_STATES.RESUME) {

                    startPlayback();
                } else if (resumePlayback === PLAYBACK_RESUME_STATES.PAUSE) {

                    pausePlayback();
                }

                break;
        }
    }
    this.changeState = changeState;

    $scope.$on('$destroy', function onDestroy() {

        videoPerformanceTimer.cleanup();
    });
}

VideoPlayerSeekingControls.directive('videoPlayerSeekingControls', videoPlayerSeekingControls);
