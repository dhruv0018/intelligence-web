const pkg = require('../../package.json');

const angular = require('angular');

const IntelligenceWebClient = angular.module(pkg.name);

/**
 * @class PlaylistManager
 */
class PlaylistManager {

    constructor () {

        this.isEditable = false;
    }

    getRelativeClipTime (play, event) {

        if (!play) throw new Error('Missing "play" parameter');
        if (!event) throw new Error('Missing "event" parameter');
        if (event.playId !== play.id) throw new Error('Event must be on the play');

        return event.time - play.startTime;
    }
}

/**
 * @module IntelligenceWebClient
 * @name PlaylistManager
 * @type {Service}
 */
IntelligenceWebClient.service('PlaylistManager', PlaylistManager);

export default PlaylistManager;
