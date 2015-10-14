const pkg = require('../../../package.json');
import UploadModel from './uploadModel';

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

class UploadManager {

    /*
     * Uploads contains uploadModels keyed by id
     */

    constructor() {

        this.uploads = {};
        this.MAX_UPLOADS = 100;

        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        window.onbeforeunload = this.onBeforeUnload;
    }

    onBeforeUnload() {

        if (this.hasRunningUploads()) {
            return 'Video still uploading! Are you sure you want to close the page and cancel the upload?';
        }
    }

    /**
     * Returns an uploadModel
     * @param {number} id A unique id identifying the UploadModel
     */
    get(id) {

        if (!id) throw new Error(`Missing required parameter 'id'`);
        if (!Number.isInteger(id)) throw new Error(`id '${id}' is not an integer`);

        return this.uploads[id];
    }

    /**
     * Creates an upload model and adds it to the UploadManager
     * @param {number} id A unique id identifying the UploadModel
     * @param {object} uploaderServiceInstance An instance dealing with uploading files that can be used in the uploadModel
     * @returns {UploadModel} UploadModel if succesfull or null if the UploadModel could not be created/added
     */
    makeUploadModel(id, uploaderServiceInstance) {

        if (!id) throw new Error(`Missing required parameter 'id'`);
        if (!Number.isInteger(id)) throw new Error(`id '${id}' is not an integer`);

        let uploadModel = new UploadModel(uploaderServiceInstance);

        let result = this.add(id, uploadModel);

        if (!result) {

            return null;

        } else {

            let boundUploadComplete = this.onUploadModelComplete.bind(this, id);
            let boundUploadError = this.onUploadModelError.bind(this, id);

            uploadModel.onComplete(boundUploadComplete);
            uploadModel.onError(boundUploadError);

            return uploadModel;
        }
    }

    /**
     * Returns true or false if the UploadModel with the 'id' is uploading
     * @param {number} id A unique id identifying an UploadModel
     * @returns {boolean}
     */
    isUploading(id) {

        if (!id) throw new Error(`Missing required parameter 'id'`);
        if (!Number.isInteger(id)) throw new Error(`id '${id}' is not an integer`);

        let uploadModel = this.get(id);

        if (!uploadModel) return false;

        // Note technicall
        return uploadModel.progress() > 0;
    }

    /**
     * Returns the progress of an UploadModel
     * @param {number} id A unique id.
     * @returns {boolean}
     */
    progress(id) {

        if (!id) throw new Error(`Missing required parameter 'id'`);
        if (!Number.isInteger(id)) throw new Error(`id '${id}' is not an integer`);

        let uploadModel = this.get(id);

        if (!uploadModel) return 0;

        return uploadModel.progress();
    }

    /**
     * Cancels and removes an UploadModel from the UploadManager
     * @param {number} id A unique id.
     */
    cancel(id) {

        if (!id) throw new Error(`Missing required parameter 'id'`);
        if (!Number.isInteger(id)) throw new Error(`id '${id}' is not an integer`);

        let uploadModel = this.get(id);

        if (uploadModel) {

            uploadModel.cancel();
            delete this.uploads[id];
        }
    }

    /**
     * Adds an UploadModel to the UploadManager
     * @param {number} id A unique id.
     * @param {UploadModel} uploadModel
     * @returns {boolean} true if successful, false otherwise
     */
    add(id, uploadModel) {

        if (!id) throw new Error(`Missing required parameter 'id'`);
        if (!uploadModel) throw new Error(`Missing required parameter 'uploadModel'`);
        if (!Number.isInteger(id)) throw new Error(`id '${id}' is not an integer`);
        if (!(uploadModel instanceof UploadModel)) throw new Error(`uploadModel is not an instanceof 'uploadModel'`);

        if (this.count() < this.MAX_UPLOADS) {

            this.uploads[id] = uploadModel;

            return true;

        } else {

            return false;
        }
    }

    /**
     * Remove is an alias for cancel()
     * @param {number} id A unique id.
     */
    remove(id) {

        if (!id) throw new Error(`Missing required parameter 'id'`);
        if (!Number.isInteger(id)) throw new Error(`id '${id}' is not an integer`);

        this.cancel(id);
    }

    /**
     * A callback for handling the complete event from an UploadModel.
     * The UploadModel with 'id' is removed when the upload completes.
     * @param {number} id A unique id specifying the UploadModel
     */
    onUploadModelComplete(id) {

        if (!id) throw new Error(`Missing required parameter 'id'`);
        if (!Number.isInteger(id)) throw new Error(`id '${id}' is not an integer`);

        let uploadModel = this.get(id);

        if (uploadModel) {

            uploadModel.cleanup();
        }

        this.remove(id);
    }

    /**
     * A callback for handling the error event from an UploadModel.
     * The UploadModel with 'id' is removed when the upload has an error.
     * @param {number} id A unique id specifying the UploadModel
     */
    onUploadModelError(id) {

        if (!id) throw new Error(`Missing required parameter 'id'`);
        if (!Number.isInteger(id)) throw new Error(`id '${id}' is not an integer`);

        let uploadModel = this.get(id);

        if (uploadModel) {

            uploadModel.cleanup();
        }

        this.remove(id);
    }

    /**
     * How many uploads are present in the UploadManager with a progress above 0.
     */
    hasRunningUploads() {

        return Object.keys(this.uploads).some((id) => {
            return this.progress(Number.parseInt(id, 10)) > 0;
        });
    }
}


/**
 * @module IntelligenceWebClient
 * @name uploadManager
 * @type {service}
 */

export default UploadManager;
IntelligenceWebClient.service('UploadManager', UploadManager);
