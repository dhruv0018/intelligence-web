const pkg = require('../../../package.json');
import UploadModel from './uploadModel';

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

class UploadManager {

    /*
     * Uploads contains uploadModels keyed by id
     */

    constructor () {

        this.uploads = {};
        this.MAX_UPLOADS = 100;
    }

    get (id) {

        return this.uploads[id];
    }

    makeUploadModel (id, flow) {

        let uploadModel = new UploadModel(flow);

        let result = this.add(id, uploadModel);

        if (result !== null) {

            return uploadModel;

        } else {

            return null;
        }
    }

    cancel (id) {

        let uploadModel = this.get(id);

        if (uploadModel) {

            uploadModel.cancel();
            this.remove(id);
        }
    }

    add (id, uploadModel) {

        if (this.count() < this.MAX_UPLOADS) {

            this.uploads[id] = uploadModel;

            return true;

        } else {

            return false;
        }
    }

    remove (id) {

        delete this.uploads[id];
    }

    print () {

        console.log(this.uploads);
    }

    count () {

        return Object.keys(this.uploads).length;
    }

    hasRunningUploads () {

        return Object.keys(uploads).some((id) => {
            return this.uploads[id].progress() > 0;
        });
    }

    pauseAll () {

        // TODO: Implement function
        // Object.keys(this.uploads).forEach((id) => {
        //     this.uploads[id].pause();
        // });
    }

    resumeAll () {

        // TODO: Implement function
        // Object.keys(uploads).forEach((id) => {
        //     this.uploads[id].resume();
        // });
    }
}


/**
 * @module IntelligenceWebClient
 * @name uploadManager
 * @type {service}
 */
IntelligenceWebClient.service('UploadManager', UploadManager);
