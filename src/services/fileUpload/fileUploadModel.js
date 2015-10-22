
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

    constructor(uploaderServiceInstance) {

        this.uploaderServiceInstance = uploaderServiceInstance;
        this.files = [];

        this.callbacks = {
            complete: [],
            error: []
        };

        this.status = UPLOAD_STATUSES.NOT_STARTED;

        this.complete = this.complete.bind(this);
        this.error = this.error.bind(this);
        this.uploaderServiceInstance.on('complete', this.complete);
        this.uploaderServiceInstance.on('error', this.error);

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
        this.uploaderServiceInstance.upload();
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

        if (this.getProgress() === 1) {

            this.status = UPLOAD_STATUSES.UPLOADED;

            this.callbacks.complete.forEach((callback) => {
                callback();
            });

        } else {

            // if the progress isn't 1 but was complete, it was cancelled
            this.cancelled();
        }
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
}

export default FileUpload;
