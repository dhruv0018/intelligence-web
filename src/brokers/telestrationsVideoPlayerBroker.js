const pkg = require('../../package.json');
const angular = require('angular');
const EventEmitter = require('events').EventEmitter;

const IntelligenceWebClient = angular.module(pkg.name);

TelestrationsVideoPlayerBrokerService.$inject = [
    'VideoPlayer',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS',
    'TelestrationsEventEmitter',
    'Telestrations',
    'TELESTRATION_EVENTS'
];

function TelestrationsVideoPlayerBrokerService(
    VideoPlayer,
    VideoPlayerEventEmitter,
    VIDEO_PLAYER_EVENTS,
    TelestrationsEventEmitter,
    Telestrations,
    TELESTRATION_EVENTS
) {

    class TelestrationsVideoPlayerBroker {

        constructor () {

            // Bind Private functions
            setupHandlers.bind(this);
            handleInitialStateChange.bind(this);
            onGlyphsVisible.bind(this);

            setupHandlers();
        }
    }

    function setupHandlers () {

        TelestrationsEventEmitter.on(TELESTRATION_EVENTS.ON_GLYPHS_VISIBLE, onGlyphsVisible);

        handleInitialStateChange();
    }

    function handleInitialStateChange () {

        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_PLAY, onVideoPlayerInitialPlay);

        function onVideoPlayerInitialPlay() {

            Telestrations.show();
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_PLAY, onVideoPlayerInitialPlay);
        }
    }

    function onGlyphsVisible() {

        VideoPlayer.pause();
    }

    return new TelestrationsVideoPlayerBroker();
}

IntelligenceWebClient.service('TelestrationsVideoPlayerBroker', TelestrationsVideoPlayerBrokerService);
