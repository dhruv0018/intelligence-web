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
            onFullScreen.bind(this);

            setupHandlers();
            handleInitialStateChange();
        }

        cleanup () {

            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.FULLSCREEN, onFullScreen);
        }
    }

    function setupHandlers () {

        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.FULLSCREEN, onFullScreen);
    }

    function handleInitialStateChange () {

        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_PLAY, onVideoPlayerInitialPlay);

        function onVideoPlayerInitialPlay() {

            Telestrations.show();
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_PLAY, onVideoPlayerInitialPlay);
        }
    }

    function onFullScreen(event) {

        // NOTE: Interact with telestrations here
    }

    return TelestrationsVideoPlayerBroker;
}

IntelligenceWebClient.factory('TelestrationsVideoPlayerBroker', TelestrationsVideoPlayerBrokerFactory);
