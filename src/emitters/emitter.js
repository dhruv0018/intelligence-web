const pkg = require('../../package.json');
const angular = require('angular');
const BaseEventEmitter = require('events').EventEmitter;

const IntelligenceWebClient = angular.module(pkg.name);

class EventEmitter extends BaseEventEmitter {

    constructor () {

        super();

        this.setMaxListeners(0);
    }
}

IntelligenceWebClient.service('EventEmitter', EventEmitter);

export default EventEmitter;
