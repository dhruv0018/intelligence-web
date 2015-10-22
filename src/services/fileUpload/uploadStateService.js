const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

/**
 * @class UploadStateService
 * @description The UploadStateService provides basic insight into the upload state
 * of a resource based on the FileUpload. States that can be derived are
 * isUploading(), isNotStarted(), isCancelled(), isUploaded(), isFailed()
 * and to get the specific progress, getProgress().
 * NOTE: This is a READ-ONLY service and should remain so. For manipulating
 * an FileUpload, get one from the FileUploadService and use it directly.
 */
UploadStateServiceFactory.$inject = [
    'FileUploadService'
];

function UploadStateServiceFactory(
    FileUploadService
) {

    class UploadStateService {

        static isUploading(resource) {

            let fileUpload = FileUploadService.get(resource.id);

            // There must be an upload model present to be uploading
            if (!fileUpload) return false;

            return fileUpload.isUploading();
        }

        static isUploaded(resource) {

            let fileUpload = FileUploadService.get(resource.id);

            // We don't know if it's uploaded if there is no upload model
            if (!fileUpload) return undefined;

            return fileUpload.isUploaded();
        }

        static isFailed(resource) {

            let fileUpload = FileUploadService.get(resource.id);

            // We don't know if it's failed if there is no upload model
            if (!fileUpload) return undefined;

            return fileUpload.isFailed();
        }

        static isCancelled() {

            let fileUpload = FileUploadService.get(resource.id);

            // We don't know if it's cancelled if there is no upload model
            if (!fileUpload) return undefined;

            return fileUpload.isCancelled();
        }

        static isNotStarted() {

            let fileUpload = FileUploadService.get(resource.id);

            // If there is no upload model, then it has not started
            if (!fileUpload) return false;

            return fileUpload.isNotStarted();
        }

        static getProgress(resource) {

            let fileUpload = FileUploadService.get(resource.id);

            // If there is no upload model, then there is no progress
            if (!fileUpload) return 0;

            return fileUpload.progress();
        }
    }

    return UploadStateService;
}

IntelligenceWebClient.factory('UploadStateService', UploadStateServiceFactory);
