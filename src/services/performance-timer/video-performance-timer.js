import PerformanceTimer from './performance-timer';

/**
 * VideoPerformanceTimer takes a `videoDomId` and keeps track of the video's `currentTime` more accurately than
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
 * @param {String} videoDomId
 */
export default class VideoPerformanceTimer extends PerformanceTimer {

    constructor(videoDomId) {

        super();
        this._getVideoEl(videoDomId);
        this._addVideoListeners();
    }

    /**
     * Resets the video timer
     * @param videoDomId {String} - the video element's unique id
     * @api public
     */
    reset(videoDomId) {

        // reset timer
        super.reset();

        // removes video listeners
        this._removeVideoListeners();

        // gets/sets new video element
        this._getVideoEl(videoDomId);

        // setup video timer
        this._addVideoListeners();
    }

    /**
     * Gets the video element from the document based on a unique string id
     * @param {String} videoDomId the video element's unique id
     */
    _getVideoEl(videoDomId) {

        this._videoEl = videoDomId ? document.getElementById(videoDomId) : this._videoEl;
        if (!this._videoEl) console.error(`No Video Player with id: ${videoDomId}`);
    }

    /**
     * Removes all internal listeners from the video element
     */
    _removeVideoListeners() {

        this._videoEl.removeEventListener('timeupdate', this._boundOnTimeUpdate);
        this._videoEl.removeEventListener('play', this._boundOPlay);
        this._videoEl.removeEventListener('pause', this._boundOnPause);
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
        this._videoEl.addEventListener('timeupdate', this._boundOnTimeUpdate);
        this._videoEl.addEventListener('play', this._boundOnPlay);
        this._videoEl.addEventListener('pause', this._boundOnPause);
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
        if (this._videoEl.paused) return;

        // set the performance time
        this.time = event.target.currentTime * 1000; // convert to ms
    }
}
