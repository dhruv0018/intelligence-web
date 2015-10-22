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

        this.uploads = {};
        this.MAX_UPLOADS = 100;

        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        window.onbeforeunload = this.onBeforeUnload;
    }

    /**
     * Creates an upload model and adds it to the FileUploadService
     * @param {string} guid A unique guid identifying the FileUpload
     * @param {object} uploaderServiceInstance An instance dealing with uploading files that can be used in the fileUpload
     * @returns {FileUpload} FileUpload if succesfull or null if the FileUpload could not be created/added
     */
    getFileUpload(guid, uploaderServiceInstance) {

        if (!guid) console.error(`Missing required parameter 'guid'`);
        if (typeof guid !== 'string') throw new Error(`'guid' must be a string`);

        let fileUpload = new FileUpload(uploaderServiceInstance);

        let result = this.add(guid, fileUpload);

        if (!result) {

            // could not add the new upload model
            fileUpload.cleanup();
            return null;

        } else {

            let boundUploadComplete = this.onFileUploadComplete.bind(this, guid);
            let boundUploadError = this.onFileUploadError.bind(this, guid);

            fileUpload.onComplete(boundUploadComplete);
            fileUpload.onError(boundUploadError);

            return fileUpload;
        }
    }

    /**
     * Returns an fileUpload
     * @param {string} guid A unique guid identifying the FileUpload
     */
    get(guid) {

        if (!guid) console.error(`Missing required parameter 'guid'`);
        if (typeof guid !== 'string') throw new Error(`'guid' must be a string`);

        return this.uploads[guid];
    }

    /**
     * @returns number of the FileUpload that are presently uploading
     */
    countRunningUploads() {

        let runningUploads = Object.keys(this.uploads).filter((guid) => {
            let fileUpload = this.get(guid);
            return fileUpload && fileUpload.isUploading();
        });

        return runningUploads.length;
    }

    /**
     * How many uploads are present in the FileUploadService with a progress above 0.
     */
    hasRunningUploads() {

        return Object.keys(this.uploads).some((guid) => {
            let fileUpload = this.get(guid);
            return fileUpload && fileUpload.isUploading();
        });
    }


    /**************************************************************************
     * PRIVATE FUNCTIONS
     *************************************************************************/

    /**
     * Adds an FileUpload to the FileUploadService
     * @param {string} guid A unique guid.
     * @param {FileUpload} fileUpload
     * @returns {boolean} true if successful, false otherwise
     */
    add(guid, fileUpload) {

        if (!guid) console.error(`Missing required parameter 'guid'`);
        if (typeof guid !== 'string') throw new Error(`'guid' must be a string`);
        if (!fileUpload) console.error(`Missing required parameter 'fileUpload'`);

        if (!(fileUpload instanceof FileUpload)) console.error(`fileUpload is not an instanceof 'fileUpload'`);

        if (this.countRunningUploads() < this.MAX_UPLOADS) {

            // will replace an existing upload model
            this.uploads[guid] = fileUpload;

            return true;

        } else {

            return false;
        }
    }

    /**
     * Remove the FileUpload with 'guid'
     * @param {string} guid A unique guid to identifying the FileUpload
     */
    remove(guid) {

        if (!guid) console.error(`Missing required parameter 'guid'`);
        if (typeof guid !== 'string') throw new Error(`'guid' must be a string`);

        let fileUpload = this.get(guid);

        if (fileUpload) {

            delete this.uploads[guid];
        }
    }

    /**
     * A callback for handling the complete event from an FileUpload.
     * @param {string} guid A unique guid specifying the FileUpload
     */
    onFileUploadComplete(guid) {

        if (!guid) console.error(`Missing required parameter 'guid'`);
        if (typeof guid !== 'string') throw new Error(`'guid' must be a string`);

        let fileUpload = this.get(guid);

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
        if (typeof guid !== 'string') throw new Error(`'guid' must be a string`);

        let fileUpload = this.get(guid);

        if (fileUpload) {

            fileUpload.cleanup();
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
