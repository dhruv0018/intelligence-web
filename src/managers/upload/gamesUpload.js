const pkg = require('../../../package.json');
import UploadManager from './upload';

/* Fetch angular from the browser scope */
const angular = window.angular;

const IntelligenceWebClient = angular.module(pkg.name);

class GamesUploadManager extends UploadManager {

    constructor(gamesFactory) {

        super();

        this.gamesFactory = gamesFactory;
    }

    /**
     * A callback for handling the complete event from an UploadModel for a
     * game. Updates the game's video to 'UPLOADED' status and saves game.
     * @param {number} id A unique id specifying the UploadModel
     */
    onUploadModelComplete(id) {

        let game = this.gamesFactory.get(id);
        game.video.setStatusToUploaded();

        if (game.video.isUploaded()) {

            game.save();
        }

        super.onUploadModelComplete(id);
    }

    /**
     * A callback for handling the error event from an UploadModel for a
     * game. Updates the game's video to 'FAILED' status and saves game.
     * @param {number} id A unique id specifying the UploadModel
     */
    onUploadModelError(id) {

        let game = this.gamesFactory.get(id);
        game.video.setStatusToFailed();

        if (game.video.isFailed()) {

            game.save();
        }

        super.onUploadModelError(id);
    }
}


/**
 * @module IntelligenceWebClient
 * @name uploadManager
 * @type {service}
 */
UploadManager.$inject = [
    'GamesFactory'
];

IntelligenceWebClient.service('GamesUploadManager', GamesUploadManager);
