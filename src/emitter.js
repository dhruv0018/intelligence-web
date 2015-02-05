var pkg = require('../package.json');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('EventEmitter', [
    'EVENT_MAP', 'EVENT_PARSER_MAP',
    function(EVENT_MAP) {

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
            emitter.emit(e.type);
        }

        //used by components to listen to events from emitter
        function subscribe(eventName, handler) {
            emitter.addListener(eventName, handler);
        }

        function unsubscribe(eventName, handler) {
            emitter.removeListener(eventName, handler);
        }

        //used by components to stop listening to an event
        return {
            register: register,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    }
]);

var EVENT_MAP = {
    'timeupdate': 'VIDEO_TIME_EMISSION'
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

var EVENT_PARSER_MAP = {
    'VIDEO_TIME_EMISSION': prepareVideoEvent
};

IntelligenceWebClient.constant('EVENT_PARSER_MAP', EVENT_PARSER_MAP);







