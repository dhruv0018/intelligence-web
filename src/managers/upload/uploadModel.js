
class UploadModel {

    constructor(uploaderServiceInstance) {

        this.uploaderServiceInstance = uploaderServiceInstance;
        this.files = [];

        this.callbacks = {
            complete: [],
            error: []
        };

        this.complete = this.complete.bind(this);
        this.error = this.error.bind(this);
        this.uploaderServiceInstance.on('complete', this.complete);
        this.uploaderServiceInstance.on('error', this.error);

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

    /**
     * Calls all of the complete callback events
     */
    complete(result) {

        if (this.progress() > 0) {
            this.callbacks.complete.forEach((callback) => {
                callback();
            });
        } else {
            this.callbacks.error.forEach((callback) => {
                callback();
            });
        }
    }

    /**
     * Calls all of the error callback events
     */
    error() {

        this.callbacks.error.forEach((callback) => {
            callback();
        });
    }

    /*
     * Starts uploading 'files'
     */
    upload() {

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
}

export default UploadModel;
