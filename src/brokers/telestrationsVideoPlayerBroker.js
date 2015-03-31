const pkg = require('../../package.json');
const angular = require('angular');
const EventEmitter = require('events').EventEmitter;

const IntelligenceWebClient = angular.module(pkg.name);

class TelestrationsVideoPlayerBroker {

    constructor (VideoPlayer, TelestrationsEventEmitter) {

        this.VideoPlayer = VideoPlayer;
        this.TelestrationsEventEmitter = TelestrationsEventEmitter;

        this.setupHandlers();
    }

    setupHandlers () {

        var self = this;

        this.TelestrationsEventEmitter.on('showingTelestrations', function onShowingTelestrations() {

            self.VideoPlayer.pause();
        });
    }
}

TelestrationsVideoPlayerBroker.$inject = ['VideoPlayer', 'TelestrationsEventEmitter'];

IntelligenceWebClient.service('TelestrationsVideoPlayerBroker', TelestrationsVideoPlayerBroker);

export default TelestrationsVideoPlayerBroker;
