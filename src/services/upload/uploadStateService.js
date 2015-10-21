const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

/**
 * @class UploadStateService
 * @description The UploadStateService provides basic insight into the upload state
 * of a resource based on the UploadModel. States that can be derived are
 * isUploading(), isNotStarted(), isCancelled(), isUploaded(), isFailed()
 * and to get the specific progress, getProgress().
 * NOTE: This is a READ-ONLY service and should remain so. For manipulating
 * an UploadModel, get one from the UploadManager and use it directly.
 */
UploadStateServiceFactory.$inject = [
    'UploadManager'
];

function UploadStateServiceFactory(
    UploadManager
) {

    class UploadStateService {

        static isUploading(resource) {

            let uploadModel = UploadManager.get(resource.id);

            // There must be an upload model present to be uploading
            if (!uploadModel) return false;

            return uploadModel.isUploading();
        }

        static isUploaded(resource) {

            let uploadModel = UploadManager.get(resource.id);

            // We don't know if it's uploaded if there is no upload model
            if (!uploadModel) return undefined;

            return uploadModel.isUploaded();
        }

        static isFailed(resource) {

            let uploadModel = UploadManager.get(resource.id);

            // We don't know if it's failed if there is no upload model
            if (!uploadModel) return undefined;

            return uploadModel.isFailed();
        }

        static isCancelled() {

            let uploadModel = UploadManager.get(resource.id);

            // We don't know if it's cancelled if there is no upload model
            if (!uploadModel) return undefined;

            return uploadModel.isCancelled();
        }

        static isNotStarted() {

            let uploadModel = UploadManager.get(resource.id);

            // If there is no upload model, then it has not started
            if (!uploadModel) return false;

            return uploadModel.isNotStarted();
        }

        static getProgress(resource) {

            let uploadModel = UploadManager.get(resource.id);

            // If there is no upload model, then there is no progress
            if (!uploadModel) return 0;

            return uploadModel.progress();
        }
    }

    return UploadStateService;
}

IntelligenceWebClient.factory('UploadStateService', UploadStateServiceFactory);
