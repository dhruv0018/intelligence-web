const pkg = require('../../package.json');
const angular = require('angular');
const EventEmitter = require('events').EventEmitter;

const IntelligenceWebClient = angular.module(pkg.name);

class PlaylistEventEmitter extends EventEmitter {

    constructor () {

        super();

        this.setMaxListeners(0);
    }
}

IntelligenceWebClient.service('PlaylistEventEmitter', PlaylistEventEmitter);

export default PlaylistEventEmitter;

