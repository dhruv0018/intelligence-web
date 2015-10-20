
const NOT_STARTED = 0;
const UPLOADING = 1;
const UPLOADED = 2;
const CANCELLED = 3;
const FAILED = 4;

class UploadModel {

    constructor(uploaderServiceInstance) {

        this.uploaderServiceInstance = uploaderServiceInstance;
        this.files = [];

        this.callbacks = {
            complete: [],
            error: []
        };

        this.status = NOT_STARTED;

        this.complete = this.complete.bind(this);
        this.error = this.error.bind(this);
        this.uploaderServiceInstance.on('complete', this.complete);
        this.uploaderServiceInstance.on('error', this.error);

    }

    isNotStarted() {

        return this.status === NOT_STARTED;
    }

    isUploaded() {

        return this.status === UPLOADED;
    }

    isUploading() {

        return this.status === UPLOADING;
    }

    isCancelled() {

        return this.status === CANCELLED;
    }

    isFailed() {

        return this.status === FAILED;
    }

    /**
     * Returns true or false if the UploadModel is uploading
     * @returns {boolean}
     */
    isUploading() {

        return this.progress() > 0 && this.progress() < 1;
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

        this.status = UPLOADING;
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

        this.uploaderServiceInstance.cancel();
    }

    /**
     * Gets the progress of an upload
     * @returns {number} Between 0 and 1 (inclusive)
     */
    progress() {

        return this.uploaderServiceInstance.progress();
    }

    /**
     * Calls all of the complete callback events and updates status
     * The uploader instance currently calls the complete method even
     * when the upload was cancelled.
     */
    complete(result) {

        if (this.progress() === 1) {

            this.status = UPLOADED;

            this.callbacks.complete.forEach((callback) => {
                callback();
            });

        } else {

            // if the progress isn't 1 but was complete, it was cancelled
            cancelled();
        }
    }

    /**
     * Calls all of the error callback events
     */
    cancelled() {

        this.status = CANCELLED;

        this.callbacks.error.forEach((callback) => {
            callback();
        });
    }

    /**
     * Calls all of the error callback events
     */
    error() {

        this.status = FAILED;

        this.callbacks.error.forEach((callback) => {
            callback();
        });
    }
}

export default UploadModel;
