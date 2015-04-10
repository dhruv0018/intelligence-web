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
}

/**
 * @module IntelligenceWebClient
 * @name PlaylistManager
 * @type {Service}
 */
IntelligenceWebClient.service('PlaylistManager', PlaylistManager);

export default PlaylistManager;
