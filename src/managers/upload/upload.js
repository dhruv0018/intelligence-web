const pkg = require('../../../package.json');
import UploadModel from './uploadModel';

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

/*
 * @class UploadManager
 *
 * The upload manager is responsible for creating and keeping track
 * of the current UploadModels {UploadModel}. It handles the adding, and
 * removal of the UploadModels. While this service is primarily used for
 * getting an UploadModel based on a unique id, it can also be used to
 * get high level metrics or information on the UploadModels it has,
 * such as number of running uploads.
 */

class UploadManager {

    constructor() {

        this.uploads = {};
        this.MAX_UPLOADS = 100;

        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        window.onbeforeunload = this.onBeforeUnload;
    }

    /**
     * Creates an upload model and adds it to the UploadManager
     * @param {number|string} id A unique id identifying the UploadModel
     * @param {object} uploaderServiceInstance An instance dealing with uploading files that can be used in the uploadModel
     * @returns {UploadModel} UploadModel if succesfull or null if the UploadModel could not be created/added
     */
    makeUploadModel(id, uploaderServiceInstance) {

        if (!id) console.error(`Missing required parameter 'id'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);

        let uploadModel = new UploadModel(uploaderServiceInstance);

        let result = this.add(id, uploadModel);

        if (!result) {

            // could not add the new upload model
            uploadModel.cleanup();
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
     * Returns an uploadModel
     * @param {number|string} id A unique id identifying the UploadModel
     */
    get(id) {

        if (!id) console.error(`Missing required parameter 'id'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);

        return this.uploads[id];
    }

    /**
     * @returns number of the UploadModel that are presently uploading
     */
    countRunningUploads() {

        let runningUploads = Object.keys(this.uploads).filter((id) => {
            return this.progress(Number.parseInt(id, 10)) > 0;
        });

        return runningUploads.length;
    }

    /**
     * How many uploads are present in the UploadManager with a progress above 0.
     */
    hasRunningUploads() {

        return Object.keys(this.uploads).some((id) => {
            return this.progress(Number.parseInt(id, 10)) > 0;
        });
    }


    /**************************************************************************
     * PRIVATE FUNCTIONS
     *************************************************************************/

    /**
     * Adds an UploadModel to the UploadManager
     * @param {number|string} id A unique id.
     * @param {UploadModel} uploadModel
     * @returns {boolean} true if successful, false otherwise
     */
    add(id, uploadModel) {

        if (!id) console.error(`Missing required parameter 'id'`);
        if (!uploadModel) console.error(`Missing required parameter 'uploadModel'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);
        if (!(uploadModel instanceof UploadModel)) console.error(`uploadModel is not an instanceof 'uploadModel'`);

        if (this.countRunningUploads() < this.MAX_UPLOADS) {

            // will replace an existing upload model
            this.uploads[id] = uploadModel;

            return true;

        } else {

            return false;
        }
    }

    /**
     * Remove the UploadModel with 'id'
     * @param {number|string} id A unique id to identifying the UploadModel
     */
    remove(id) {

        if (!id) console.error(`Missing required parameter 'id'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);

        let uploadModel = this.get(id);

        if (uploadModel) {

            delete this.uploads[id];
        }
    }

    /**
     * A callback for handling the complete event from an UploadModel.
     * The UploadModel with 'id' is removed when the upload completes.
     * @param {number|string} id A unique id specifying the UploadModel
     */
    onUploadModelComplete(id) {

        if (!id) console.error(`Missing required parameter 'id'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);

        let uploadModel = this.get(id);

        if (uploadModel) {

            uploadModel.cleanup();
        }

        this.remove(id);
    }

    /**
     * A callback for handling the error event from an UploadModel.
     * The UploadModel with 'id' is removed when the upload has an error.
     * @param {number|string} id A unique id specifying the UploadModel
     */
    onUploadModelError(id) {

        if (!id) console.error(`Missing required parameter 'id'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);

        let uploadModel = this.get(id);

        if (uploadModel) {

            uploadModel.cleanup();
        }

        this.remove(id);
    }

    onBeforeUnload() {

        if (this.hasRunningUploads()) {
            return 'Video still uploading! Are you sure you want to close the page and cancel the upload?';
        }
    }
}


/**
 * @module IntelligenceWebClient
 * @name uploadManager
 * @type {service}
 */

export default UploadManager;
IntelligenceWebClient.service('UploadManager', UploadManager);
