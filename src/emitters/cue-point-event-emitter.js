const pkg = require('../../package.json');
const angular = require('angular');
const EventEmitter = require('events').EventEmitter;

const IntelligenceWebClient = angular.module(pkg.name);

class CuePointEventEmitter extends EventEmitter {

    constructor () {

        super();

        this.setMaxListeners(0);
    }
}

IntelligenceWebClient.service('CuePointEventEmitter', CuePointEventEmitter);

export default CuePointEventEmitter;
