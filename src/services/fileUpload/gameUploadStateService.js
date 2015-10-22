const pkg = require('../../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

GameUploadStateServiceFactory.$inject = [
    'UploadStateService',
    'FileUploadService'
];

function GameUploadStateServiceFactory(
    UploadStateService,
    FileUploadService
) {

    class GameUploadStateService extends UploadStateService {

        static isFailed(game) {

            let uploadModel = FileUploadService.get(game.id);

            // NOTE: The upload surely isFailed if there is no upload in progress,
            // but the server thinks that there is still (e.g. if user refreshses during upload)
            if (!uploadModel) {

                return game.video.isIncomplete();

            } else {

                // NOTE: The failure could come from server or client-side
                return super.isFailed(game) ||
                    game.video.isFailed();
            }
        }

        static isUploaded(game) {

            /** NOTE: Both the server/client may not be in sync at this point
             * The video has uploaded if the upload model says so or the Video
             * thinks that it has. During this time, the video will be processed/transcoded
             */
            return super.isUploaded(game) || game.video.isUploaded();
        }

        static isProcessed(game) {

            return game.video.isComplete();
        }
    }

    return GameUploadStateService;
}

IntelligenceWebClient.factory('GameUploadStateService', GameUploadStateServiceFactory);
