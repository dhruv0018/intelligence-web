const pkg = require('../../../package.json');
import FileUpload from './fileUploadModel';

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

/**
 * @class FileUploadService
 * @description The FileUploadService is responsible for creating and keeping track
 * of the current FileUploads {FileUpload}. It handles the adding, and
 * removal of the FileUploads. While this service is primarily used for
 * getting an FileUpload based on a unique guid, it can also be used to
 * get high level metrics or information on the FileUploads it has,
 * such as number of running uploads.
 */

class FileUploadService {

    constructor() {

        this.fileUploads = {};
        this.MAX_UPLOADS = 100;

        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        window.onbeforeunload = this.onBeforeUnload;
    }

    /**
     * Will get an existing or new FileUpload model if an 'uploaderServiceInstance' is provided.
     * @param {string} guid A unique guid identifying the FileUpload
     * @param {object} uploaderServiceInstance An instance dealing with uploading files that can be used in the fileUpload
     * @returns {FileUpload} FileUpload if successful or null if the FileUpload could not be retrieved
     */
    getFileUpload(guid, uploaderServiceInstance) {

        if (!guid) console.error(`Missing required parameter 'guid'`);
        if (typeof guid !== 'string') console.error(`'guid' must be a string`);

        // Get a file upload from memory
        if (!uploaderServiceInstance) {

            return this.fileUploads[guid];
        }

        // Create new file upload if not too many concurrent uploads
        if (this.countRunningUploads() < this.MAX_UPLOADS) {

            let fileUpload = new FileUpload(uploaderServiceInstance);

            this.fileUploads[guid] = fileUpload;

            let boundUploadComplete = this.onFileUploadComplete.bind(this, guid);
            let boundUploadError = this.onFileUploadError.bind(this, guid);

            fileUpload.onComplete(boundUploadComplete);
            fileUpload.onError(boundUploadError);

            return fileUpload;
        }
    }

    /**
     * @returns number of the FileUpload that are presently uploading
     */
    countRunningUploads() {

        let runningUploads = Object.keys(this.fileUploads).filter((guid) => {
            let fileUpload = this.fileUploads[guid];
            return fileUpload && fileUpload.isUploading();
        });

        return runningUploads.length;
    }

    /**
     * How many uploads are present in the FileUploadService with a progress above 0.
     */
    hasRunningUploads() {

        return Object.keys(this.fileUploads).some((guid) => {
            let fileUpload = this.fileUploads[guid];
            return fileUpload && fileUpload.isUploading();
        });
    }


    /**************************************************************************
     * PRIVATE FUNCTIONS
     *************************************************************************/

    /**
     * Remove the FileUpload with 'guid'
     * @param {string} guid A unique guid to identifying the FileUpload
     */
    remove(guid) {

        if (!guid) console.error(`Missing required parameter 'guid'`);
        if (typeof guid !== 'string') console.error(`'guid' must be a string`);

        delete this.fileUploads[guid];
    }

    /**
     * A callback for handling the complete event from an FileUpload.
     * @param {string} guid A unique guid specifying the FileUpload
     */
    onFileUploadComplete(guid) {

        if (!guid) console.error(`Missing required parameter 'guid'`);
        if (typeof guid !== 'string') console.error(`'guid' must be a string`);

        let fileUpload = this.fileUploads[guid];

        if (fileUpload) {

            fileUpload.cleanup();
        }
    }

    /**
     * A callback for handling the error event from an FileUpload.
     * @param {string} guid A unique guid specifying the FileUpload
     */
    onFileUploadError(guid) {

        if (!guid) console.error(`Missing required parameter 'guid'`);
        if (typeof guid !== 'string') console.error(`'guid' must be a string`);

        let fileUpload = this.fileUploads[guid];

        if (fileUpload) {

            fileUpload.cleanup();
        }
    }

    onBeforeUnload() {

        if (this.hasRunningUploads()) {
            return 'Video still uploading! Your upload will be canceled if you reload this page.';
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
