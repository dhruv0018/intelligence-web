const pkg = require('../../package.json');
const angular = require('angular');
const EventEmitter = require('events').EventEmitter;

const IntelligenceWebClient = angular.module(pkg.name);

TelestrationsVideoPlayerBrokerFactory.$inject = [
    'VideoPlayer',
    'VideoPlayerEventEmitter',
    'VIDEO_PLAYER_EVENTS',
    'TelestrationsEventEmitter',
    'Telestrations',
    'TELESTRATION_EVENTS'
];

function TelestrationsVideoPlayerBrokerFactory(
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
            onFullScreen.bind(this);

            setupHandlers();
            handleInitialStateChange();
        }

        cleanup () {

            TelestrationsEventEmitter.removeListener(TELESTRATION_EVENTS.ON_GLYPHS_VISIBLE, onGlyphsVisible);
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.FULLSCREEN, onFullScreen);
        }
    }

    function setupHandlers () {

        TelestrationsEventEmitter.on(TELESTRATION_EVENTS.ON_GLYPHS_VISIBLE, onGlyphsVisible);
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.FULLSCREEN, onFullScreen);
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

    function onFullScreen(event) {

        Telestrations.onFullScreenChange(event.isFullScreen);
    }

    return TelestrationsVideoPlayerBroker;
}

IntelligenceWebClient.factory('TelestrationsVideoPlayerBroker', TelestrationsVideoPlayerBrokerFactory);
