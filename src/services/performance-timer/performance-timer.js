/**
 * Creates a new PerformanceTimer.
 * @class class PerformanceTimer
 */
class PerformanceTimer {

    constructor() {

        this._time = {
            currentTime: 0 // in milliseconds
        };

        this._paused = true;
    }

    /**
     * Returns the 'time' object that can be observed via Object.observe
     * @returns {{currentTime: number}} time object that can be observed for changes using Object.observe()
     * @api public
     */
    get observableTime() {

        return this._time;
    }

    /**
     * Returns the current time
     * @returns {Number} the timers current time in ms since it began from 0
     * @api public
     */
    get time() {

        return this._time.currentTime;
    }

    /**
     * Sets the current time
     * @param {Number} timeMillisecond
     * @api public
     */
    set time(timeMillisecond) {

        this._time.currentTime = timeMillisecond;
    }

    /**
     * Start the timer
     * @api public
     */
    start() {

        if (this._paused) this._paused = false;
        else return; // already started

        cancelAnimationFrame(this._frameId);

        this._lastTime = performance.now();

        this._frameId = this._updateTime();
    }

    /*
     * Pause the timer from timing
     * @api public
     */
    pause() {

        if (!this._paused) this._paused = true;
        else return; // already paused

        cancelAnimationFrame(this._frameId);
    }

    /**
     * Cancels timer & resets time to 0
     * @api public
     */
    reset() {

        cancelAnimationFrame(this._frameId);

        this._paused = true;

        this._time.currentTime = 0;
    }

    /**
     * Cleanup resets the performance timer
     * @api public
     */
    cleanup() {

        this.reset();
    }

    /**
     * Updates the timer
     */
    _updateTime() {

        if (this._paused) return;

        let now = performance.now(); // milliseconds
        let timeDelta = (now - this._lastTime); // milliseconds
        this._lastTime = now;

        // increment now by the difference between now and the last set time
        this._time.currentTime += timeDelta;

        // update the time
        this._frameId = requestAnimationFrame(this._updateTime.bind(this));
    }
}

export default PerformanceTimer;
