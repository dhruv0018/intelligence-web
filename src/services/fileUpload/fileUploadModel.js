const UPLOAD_STATUSES = {
    NOT_STARTED: 0,
    UPLOADING: 1,
    UPLOADED: 2,
    CANCELLED: 3,
    FAILED: 4
};



/**
 * @class FileUpload
 * @description The FileUpload encapsulates any 3rd party File Uploading Utility.
 * It provides helper functions for determining the state of an upload and changing
 * the state such as 'cancel', 'upload', etc.
 */
class FileUpload {

    /**
     * Takes an uploaderServiceInstance (e.g. Flow/Evaporate instance)
     * @param {object} uploaderServiceInstance
     */
    constructor(uploaderServiceInstance) {

        this.uploaderServiceInstance = uploaderServiceInstance;
        this.files = [];

        this.callbacks = {
            complete: [],
            error: [],
            partial: [],
            progress: [],
            warn: [],
            failedAuth: []
        };

        this.status = UPLOAD_STATUSES.NOT_STARTED;

        this.complete = this.complete.bind(this);
        this.error = this.error.bind(this);
        this.partial = this.partial.bind(this);
        this.progress = this.progress.bind(this);
        this.warn = this.warn.bind(this);
        this.failedAuth = this.failedAuth.bind(this);

        this.uploaderServiceInstance.on('complete', this.complete);
        this.uploaderServiceInstance.on('error', this.error);
        this.uploaderServiceInstance.on('partial', this.partial);
        this.uploaderServiceInstance.on('progress', this.progress);
        this.uploaderServiceInstance.on('warn', this.warn);
        this.uploaderServiceInstance.on('failedAuth', this.failedAuth);
    }

    isNotStarted() {

        return this.status === UPLOAD_STATUSES.NOT_STARTED;
    }

    isUploaded() {

        return this.status === UPLOAD_STATUSES.UPLOADED;
    }

    isUploading() {

        return this.status === UPLOAD_STATUSES.UPLOADING;
    }

    isCancelled() {

        return this.status === UPLOAD_STATUSES.CANCELLED;
    }

    isFailed() {

        return this.status === UPLOAD_STATUSES.FAILED;
    }

    /**
     * Adds a callback to an array of callbacks that will be called when
     * the upload completes.
     * @param {function} callback
     */
    onComplete(callback) {

        if (!callback) throw new Error(`onComplete requires the callback argument`);
        if (typeof callback !== 'function') throw new Error(`callback is not a function`);

        this.callbacks.complete.push(callback);
    }

    /**
     * Add a callback to an array of callbacks that will be callend when
     * the uploading progress is updated.
     * @param  {function} callback
     */
    onProgress(callback) {
        if (!callback) throw new Error(`onProgress requires the callback argument`);
        if (typeof callback !== 'function') throw new Error(`callback is not a function`);

        this.callbacks.progress.push(callback);
    }

    /**
     * Add a callback to an array of callbacks that will be callend when
     * a single file is done uploading.
     * @param  {function} callback
     */
    onPartial(callback) {
        if (!callback) throw new Error(`onPartialartial requires the callback argument`);
        if (typeof callback !== 'function') throw new Error(`callback is not a function`);

        this.callbacks.partial.push(callback);
    }

    /**
     * Adds a callback to an array of callbacks that will be called when
     * the upload has an error.
     * @param {function} callback
     */
    onError(callback) {

        if (!callback) throw new Error(`onError requires the callback argument`);
        if (typeof callback !== 'function') throw new Error(`callback is not a function`);

        this.callbacks.error.push(callback);
    }

    /**
     * Adds a callback to an array of callbacks that will be called when
     * the upload has an warning.
     * @param {function} callback
     */
    onWarn(callback) {

        if (!callback) throw new Error(`onWarn requires the callback argument`);
        if (typeof callback !== 'function') throw new Error(`callback is not a function`);

        this.callbacks.warn.push(callback);
    }

    onFailedAuth(callback) {
        if (!callback) throw new Error(`onFailedAuth requires the callback argument`);
        if (typeof callback !== 'function') throw new Error(`callback is not a function`);

        this.callbacks.failedAuth.push(callback);
    }

    /**
     * Removes any event listeners
     */
    cleanup() {
        this.uploaderServiceInstance.off('complete', this.complete);
        this.uploaderServiceInstance.off('error', this.error);
    }

    /*
     * Starts uploading 'files'
     */
    upload() {

        this.status = UPLOAD_STATUSES.UPLOADING;
        this.uploaderServiceInstance.upload(this.files);
    }

    /**
     * Adds a file to the files to be uploaded
     * @param {file} file
     * @param {string} fileName A unique name identifying the file name
     */
    addFile(file, fileName) {

        this.files.push({
            file,
            fileName
        });
    }

    /**
     * Cancels the upload
     */
    cancel() {

        this.status = UPLOAD_STATUSES.CANCELLED;
        this.uploaderServiceInstance.cancel();
    }

    /**
     * Gets the progress of an upload
     * @returns {number} Between 0 and 1 (inclusive)
     */
    getProgress() {

        return this.uploaderServiceInstance.progress();
    }

    /**
     * Calls all of the complete callback events and updates status
     * The uploader instance currently calls the complete method even
     * when the upload was cancelled.
     */
    complete(result) {

        if (this.getProgress() === 1 && this.status != UPLOAD_STATUSES.UPLOADED ) {

            this.status = UPLOAD_STATUSES.UPLOADED;

            this.callbacks.complete.forEach((callback) => {
                callback(result);
            });

        } else {
            // if the progress isn't 1 but was complete, it was cancelled
            this.cancelled(result);
        }
    }

    /**
     * Calls when a single file is done uploaded
     *
     * @method     partial
     * @param      {object}  result
     */
    partial(result) {
        this.callbacks.partial.forEach((callback) => {
            callback(result);
        });

    }

    /**
     * Calls all of the progress callback events
     * @param  {object} result
     */
    progress(result) {
        this.callbacks.progress.forEach((callback) => {
            callback(result);
        });

    }
    /**
     * Calls all of the error callback events
     */
    cancelled() {

        this.callbacks.error.forEach((callback) => {
            callback();
        });
    }

    /**
     * Calls all of the error callback events
     */
    error() {

        this.status = UPLOAD_STATUSES.FAILED;

        this.callbacks.error.forEach((callback) => {
            callback();
        });
    }


    /**
     * Calls all of the warn callback events
     */
    warn() {
        this.callbacks.warn.forEach((callback) => {
            callback();
        });
    }

    /**
     * Calls all of the failedAuth callback events
     */
    failedAuth() {
        this.callbacks.failedAuth.forEach((callback) => {
            callback();
        });
    }
}

export default FileUpload;
