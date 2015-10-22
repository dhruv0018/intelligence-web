const pkg = require('../../../package.json');
import UploadModel from './uploadModel';

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

/**
 * @class FileUploadService
 * @description The FileUploadService is responsible for creating and keeping track
 * of the current UploadModels {UploadModel}. It handles the adding, and
 * removal of the UploadModels. While this service is primarily used for
 * getting an UploadModel based on a unique id, it can also be used to
 * get high level metrics or information on the UploadModels it has,
 * such as number of running uploads.
 */

class FileUploadService {

    constructor() {

        this.uploads = {};
        this.MAX_UPLOADS = 100;

        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        window.onbeforeunload = this.onBeforeUnload;
    }

    /**
     * Creates an upload model and adds it to the FileUploadService
     * @param {number|string} id A unique id identifying the UploadModel
     * @param {object} uploaderServiceInstance An instance dealing with uploading files that can be used in the uploadModel
     * @returns {UploadModel} UploadModel if succesfull or null if the UploadModel could not be created/added
     */
    getUploadModel(id, uploaderServiceInstance) {

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
            let uploadModel = this.get(id);
            return uploadModel && uploadModel.isUploading();
        });

        return runningUploads.length;
    }

    /**
     * How many uploads are present in the FileUploadService with a progress above 0.
     */
    hasRunningUploads() {

        return Object.keys(this.uploads).some((id) => {
            let uploadModel = this.get(id);
            return uploadModel && uploadModel.isUploading();
        });
    }


    /**************************************************************************
     * PRIVATE FUNCTIONS
     *************************************************************************/

    /**
     * Adds an UploadModel to the FileUploadService
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
    }

    /**
     * A callback for handling the error event from an UploadModel.
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
    }

    onBeforeUnload() {

        if (this.hasRunningUploads()) {
            return 'Video still uploading! Are you sure you want to close the page and cancel the upload?';
        }
    }
}


/**
 * @module IntelligenceWebClient
 * @name FileUploadService
 * @type {service}
 */

export default FileUploadService;
IntelligenceWebClient.service('FileUploadService', FileUploadService);
