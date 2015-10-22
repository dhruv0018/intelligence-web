const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

gameVideoStatusService.$inject = [
    'UploadStateService',
    'FileUploadService'
];

function gameVideoStatusService(
    UploadStateService,
    FileUploadService
) {

    class GameVideoStatusService {

        static isFailed(game) {

            let fileUpload = FileUploadService.get(game.id);

            // NOTE: The upload surely isFailed if there is no upload in progress,
            // but the server thinks that there is still (e.g. if user refreshses during upload)
            if (!fileUpload) {

                return game.video.isIncomplete();

            } else {

                // NOTE: The failure could come from server or client-side
                return UploadStateService.isFailed(game) ||
                    game.video.isFailed();
            }
        }

        static isUploaded(game) {

            /** NOTE: Both the server/client may not be in sync at this point
             * The video has uploaded if the upload model says so or the Video
             * thinks that it has. During this time, the video will be processed/transcoded
             */
            return UploadStateService.isUploaded(game) || game.video.isUploaded();
        }

        static isProcessed(game) {

            return game.video.isComplete();
        }
    }

    return GameVideoStatusService;
}

IntelligenceWebClient.factory('GameVideoStatusService', gameVideoStatusService);
