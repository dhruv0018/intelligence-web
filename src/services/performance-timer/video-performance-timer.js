import PerformanceTimer from './performance-timer';

/**
 * VideoPerformanceTimer takes a `videoElementOrId` and keeps track of the video's `currentTime` more accurately than
 * the browser normally provides. It does so by interpolating values between video events using performance.now()
 *
 * @example
 *      // create timer for video from element on document (i.e. <video id="myVideo">...</video>)
 *      let videoPerformanceTimer = new VideoPerformanceTimer('myVideo')
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
export default class VideoPerformanceTimer extends PerformanceTimer {

    constructor(videoElementOrId) {

        super();

        this._setVideoElement(videoElementOrId);

        this._addVideoListeners();
    }

    /**
     * Resets the video timer
     * @param {String} [videoElementOrId] - the video element or unique id
     * @api public
     */
    reset(videoElementOrId) {

        // reset timer
        super.reset();

        // removes video listeners
        if (videoElementOrId) {

            this._removeVideoListeners();

            // gets/sets new video element
            this._setVideoElement(videoElementOrId);

            // setup video timer
            this._addVideoListeners();
        }
    }

    /**
     * Sets the video element from the document based on a unique string id or a video element.
     * @param {String} videoElementOrId the video element's unique id
     */
    _setVideoElement(videoElementOrId) {

        // videoElementOrId is a video tag
        if (videoElementOrId.tagName === 'VIDEO') {

            this._videoElement = videoElementOrId;

        } else if (typeof videoElementOrId === 'string') {

            let videoElement = document.getElementById(videoElementOrId);

            if (!videoElement) {

                throw new Error(`Cannot create new PerformanceVideoTimer: No Video Player with id: ${videoDomId}`);

            } else {

                this._videoElement = videoElement;
            }
        }
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

        // set the performance time
        this.time = event.target.currentTime * 1000; // convert to ms

        super.start();
    }

    /**
     * Handles the 'pause' event from the video element
     */
    _onPause(event) {

        // set the performance time
        this.time = event.target.currentTime * 1000; // convert to ms
        super.pause();
    }

    /**
     * Handles the 'timeupdate' event from the video element
     */
    _onTimeUpdate(event) {

        // ignore update event if video already paused
        if (this._videoElement.paused) return;

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
