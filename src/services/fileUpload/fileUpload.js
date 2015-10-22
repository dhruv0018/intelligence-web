const pkg = require('../../../package.json');
import FileUpload from './fileUpload';

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

/**
 * @class FileUploadService
 * @description The FileUploadService is responsible for creating and keeping track
 * of the current FileUploads {FileUpload}. It handles the adding, and
 * removal of the FileUploads. While this service is primarily used for
 * getting an FileUpload based on a unique id, it can also be used to
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
     * @param {number|string} id A unique id identifying the FileUpload
     * @param {object} uploaderServiceInstance An instance dealing with uploading files that can be used in the fileUpload
     * @returns {FileUpload} FileUpload if succesfull or null if the FileUpload could not be created/added
     */
    getFileUpload(id, uploaderServiceInstance) {

        if (!id) console.error(`Missing required parameter 'id'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);

        let fileUpload = new FileUpload(uploaderServiceInstance);

        let result = this.add(id, fileUpload);

        if (!result) {

            // could not add the new upload model
            fileUpload.cleanup();
            return null;

        } else {

            let boundUploadComplete = this.onFileUploadComplete.bind(this, id);
            let boundUploadError = this.onFileUploadError.bind(this, id);

            fileUpload.onComplete(boundUploadComplete);
            fileUpload.onError(boundUploadError);

            return fileUpload;
        }
    }

    /**
     * Returns an fileUpload
     * @param {number|string} id A unique id identifying the FileUpload
     */
    get(id) {

        if (!id) console.error(`Missing required parameter 'id'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);

        return this.uploads[id];
    }

    /**
     * @returns number of the FileUpload that are presently uploading
     */
    countRunningUploads() {

        let runningUploads = Object.keys(this.uploads).filter((id) => {
            let fileUpload = this.get(id);
            return fileUpload && fileUpload.isUploading();
        });

        return runningUploads.length;
    }

    /**
     * How many uploads are present in the FileUploadService with a progress above 0.
     */
    hasRunningUploads() {

        return Object.keys(this.uploads).some((id) => {
            let fileUpload = this.get(id);
            return fileUpload && fileUpload.isUploading();
        });
    }


    /**************************************************************************
     * PRIVATE FUNCTIONS
     *************************************************************************/

    /**
     * Adds an FileUpload to the FileUploadService
     * @param {number|string} id A unique id.
     * @param {FileUpload} fileUpload
     * @returns {boolean} true if successful, false otherwise
     */
    add(id, fileUpload) {

        if (!id) console.error(`Missing required parameter 'id'`);
        if (!fileUpload) console.error(`Missing required parameter 'fileUpload'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);
        if (!(fileUpload instanceof FileUpload)) console.error(`fileUpload is not an instanceof 'fileUpload'`);

        if (this.countRunningUploads() < this.MAX_UPLOADS) {

            // will replace an existing upload model
            this.uploads[id] = fileUpload;

            return true;

        } else {

            return false;
        }
    }

    /**
     * Remove the FileUpload with 'id'
     * @param {number|string} id A unique id to identifying the FileUpload
     */
    remove(id) {

        if (!id) console.error(`Missing required parameter 'id'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);

        let fileUpload = this.get(id);

        if (fileUpload) {

            delete this.uploads[id];
        }
    }

    /**
     * A callback for handling the complete event from an FileUpload.
     * @param {number|string} id A unique id specifying the FileUpload
     */
    onFileUploadComplete(id) {

        if (!id) console.error(`Missing required parameter 'id'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);

        let fileUpload = this.get(id);

        if (fileUpload) {

            fileUpload.cleanup();
        }
    }

    /**
     * A callback for handling the error event from an FileUpload.
     * @param {number|string} id A unique id specifying the FileUpload
     */
    onFileUploadError(id) {

        if (!id) console.error(`Missing required parameter 'id'`);
        id = Number.parseInt(id, 10);
        if (!Number.isInteger(id)) console.error(`id '${id}' is not an integer`);

        let fileUpload = this.get(id);

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
