import PerformanceTimer from './performance-timer';

/**
 * VideoPerformanceTimer takes a `videoElement` and keeps track of the video's `currentTime` more accurately than
 * the browser normally provides. It does so by interpolating values between video events using performance.now()
 *
 * **Warning**: This does not mean that the video element is actually set to the `currentTime` as is being calculated.
 * It is simply an approximated currentTime of the video.
 *
 * @example
 *      // create timer for video from element on document (i.e. <video id="myVideo">...</video>)
 *      let videoElement = document.getElementById('myVideo');
 *      let videoPerformanceTimer = new VideoPerformanceTimer(videoElement);
 *      // observe changes to the video's time
 *      Object.observe(videoPerformanceTimer.observableTime, function(timeObject) {
 *          let currentTime = timeObject[0].object.currentTime;
 *          console.log(`video time is: ${currentTime} in milliseconds`);
 *      });
 *
 * @class
 * @augments PerformanceTimer
 * @param {String} videoElementOrId
 */
class VideoPerformanceTimer extends PerformanceTimer {

    constructor(videoElement) {

        super();

        this._setVideoElement(videoElement);

        this._addVideoListeners();
    }

    /**
     * Resets the video timer and the videoElement & its listeners if a videoElement is provided.
     * @param {String} [videoElement] the video element
     * @api public
     */
    reset(videoElement) {

        // reset timer
        super.reset();

        // removes video listeners
        if (videoElement) {

            this._removeVideoListeners();

            // gets/sets new video element
            this._setVideoElement(videoElement);

            // setup video timer
            this._addVideoListeners();
        }
    }

    /**
     * Sets the video element
     * @param {Object} videoElement
     */
    _setVideoElement(videoElement) {

        if (!videoElement || videoElement.tagName !== 'VIDEO') {

            throw new Error(`invalid 'videoElement' parameter - ${videoElement}`);
        }

        this._videoElement = videoElement;
    }

    /**
     * Removes all internal listeners from the video element
     */
    _removeVideoListeners() {

        this._videoElement.removeEventListener('timeupdate', this._boundOnTimeUpdate);
        this._videoElement.removeEventListener('play', this._boundOPlay);
        this._videoElement.removeEventListener('pause', this._boundOnPause);
    }

    /**
     * Adds all internal listeners from the video element
     */
    _addVideoListeners() {

        if (!this._videoElement) throw new Error('this._videoElement is undefined. Call _setVideoElement first');

        // bind listener functions
        this._boundOnTimeUpdate = this._onTimeUpdate.bind(this);
        this._boundOnPlay = this._onPlay.bind(this);
        this._boundOnPause = this._onPause.bind(this);

        // add bound functions to listener
        this._videoElement.addEventListener('timeupdate', this._boundOnTimeUpdate);
        this._videoElement.addEventListener('play', this._boundOnPlay);
        this._videoElement.addEventListener('pause', this._boundOnPause);
    }

    /**
     * Handles the 'play' event from the video element
     */
    _onPlay(event) {

        if (!event) return;

        // set the performance time
        this.time = event.target.currentTime * 1000; // convert to ms

        super.start();
    }

    /**
     * Handles the 'pause' event from the video element
     */
    _onPause(event) {

        if (!event) return;

        // set the performance time
        this.time = event.target.currentTime * 1000; // convert to ms
        super.pause();
    }

    /**
     * Handles the 'timeupdate' event from the video element
     */
    _onTimeUpdate(event) {

        if (!event) return;

        // set the performance time
        this.time = event.target.currentTime * 1000; // convert to ms
    }

    /**
     * Resets and removes any handlers
     * @api public
     */
    cleanup() {

        super.cleanup();
        this._removeVideoListeners();
    }
}

export default VideoPerformanceTimer;
