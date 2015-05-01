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

        require: '^videogular',

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
    'RESUME_STATES',
    'VG_STATES'
];

function VideoPlayerSeekingControlsController (
    $scope,
    $element,
    config,
    VIDEO_PLAYER_EVENTS,
    VideoPlayerEventEmitter,
    SEEKING_STATES,
    RESUME_STATES,
    VG_STATES
) {

    let animationFrame;
    let seekTime;
    let stepTime;
    let stepStart       = null;
    let seekingState    = SEEKING_STATES.NOT_SEEKING;
    let resumePlayback  = RESUME_STATES.DEFAULT;
    let videogular      = $element.inheritedData('$videogularController');
    let mediaElement    = videogular.mediaElement[0];
    let playPauseButton = $element.find('vg-play-pause-button');

    $scope.seekingState = SEEKING_STATES.NOT_SEEKING;

    $scope.$on('$destroy', onDestroy);

    Mousetrap.bind('space', onSpace);

    playPauseButton.bind('click', onPlayPauseClick);

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

        if (seekingState === SEEKING_STATES.NOT_SEEKING) return;

        resumePlayback = RESUME_STATES.DEFAULT;
        changeState(SEEKING_STATES.NOT_SEEKING);
    }

    /**
     * Start video playback. Saves current play state for playback resume
     * after seeking.
     * @return undefined
     */

    function startPlayback () {

        if (videogular.currentState !== VG_STATES.PLAY) {

            videogular.play();
            resumePlayback = RESUME_STATES.PAUSE;
        }
    }

    /**
     * Stop video playback. Saves current play state for playback resume
     * after seeking.
     * @return undefined
     */

    function pausePlayback() {

        if (videogular.currentState === VG_STATES.PLAY) {

            resumePlayback = RESUME_STATES.RESUME;
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

        seekTime       = mediaElement.currentTime;
        stepTime       = config.videoplayer.stepTime[speed] * mediaElement.playbackRate;
        animationFrame = requestAnimationFrame(step);
    }

    /**
     * Backward seeking step.
     * @param {Number} timestamp - Current stepping time.
     * @return undefined
     */

    function step (timestamp) {

        if (!stepStart) stepStart = timestamp;
        if (!mediaElement.seeking && (timestamp - stepStart) / 1000 >= stepTime) {

            stepStart = timestamp;
            mediaElement.currentTime = seekTime -= stepTime;
        }

        animationFrame = requestAnimationFrame(step);
    }

    /**
     * Remove event handlers.
     * @return undefined
     */

    function onDestroy () {

        playPauseButton.unbind('click', onPlayPauseClick);
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

                if (resumePlayback === RESUME_STATES.RESUME) {

                    startPlayback();
                } else if (resumePlayback === RESUME_STATES.PAUSE) {

                    pausePlayback();
                }

                break;
        }
    }
    this.changeState = changeState;
}

VideoPlayerSeekingControls.directive('videoPlayerSeekingControls', videoPlayerSeekingControls);
