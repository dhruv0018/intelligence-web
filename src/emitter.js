var pkg = require('../package.json');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('VideoPlayerEventEmitter', EventEmitter);

IntelligenceWebClient.service('EventEmitter', [
    'EVENT_MAP', 'EVENT_PARSER_MAP',
    function(EVENT_MAP, EVENT_PARSER_MAP) {
        var MAX_LISTENERS = 10000;
        emitter.setMaxListeners(MAX_LISTENERS);

        //used by components to submit raw events to the emitter
        function register(e) {
            var parsedEvent = parseEvent(e);
            publish(parsedEvent);
        }

        //turns raw events into events useful to our application
        function parseEvent(e) {
            var eventProperties = EVENT_PARSER_MAP[EVENT_MAP[e.type]](e);
            return new CustomEvent(EVENT_MAP[e.type], eventProperties);
        }

        //used by the emitter to create custom events to emit to components
        function publish(e) {
            emitter.emit(e.type, e);
        }

        //used by components to listen to events from emitter
        function subscribe(eventName, handler) {
            emitter.addListener(eventName, handler);
        }

        //used by components to stop listening to an event
        function unsubscribe(eventName, handler) {
            emitter.removeListener(eventName, handler);
        }

        return {
            register: register,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    }
]);

var EVENT_MAP = {
    'timeupdate': 'VIDEO_TIME_EMISSION',
    'canplay': 'VIDEO_CAN_PLAY_EMISSION',
    'play': 'VIDEO_PLAY_EMISSION',
    'seeking': 'VIDEO_SEEKING_EMISSION',
    'pause': 'VIDEO_PAUSE_EMISSION',
    //custom event to custom event mapping
    'stopvideo': 'VIDEO_STOP_COMMAND',
    'clip-completion': 'PLAYLIST_SWITCH_CLIP_COMMAND',
    'fullscreen': 'FULLSCREEN'
};

IntelligenceWebClient.constant('EVENT_MAP', EVENT_MAP);


//---Event Preparation Methods

//constructs the properties of a custom video event
function prepareVideoEvent(e) {
    return {
        detail: {
            time: e.currentTarget.currentTime,
            duration: e.currentTarget.duration
        },
        cancellable: true,
        bubbles: true
    };
}

function defaultEventProperties() {
    return {
        detail: {},
        cancellable: true,
        bubbles: true
    };
}
var EVENT_PARSER_MAP = {
    'VIDEO_TIME_EMISSION': prepareVideoEvent,
    'VIDEO_STOP_COMMAND': defaultEventProperties,
    'VIDEO_PLAY_EMISSION': defaultEventProperties,
    'VIDEO_SEEKING_EMISSION': prepareVideoEvent,
    'VIDEO_PAUSE_EMISSION': defaultEventProperties,
    'VIDEO_CAN_PLAY_EMISSION': defaultEventProperties,
    'PLAYLIST_SWITCH_CLIP_COMMAND': defaultEventProperties,
    'FULLSCREEN': defaultEventProperties
};

IntelligenceWebClient.constant('EVENT_PARSER_MAP', EVENT_PARSER_MAP);
