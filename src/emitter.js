var pkg = require('../package.json');
var emitter = require('events').EventEmitter;

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

IntelligenceWebClient.service('EventEmitter', [
    'EVENT_MAP',
    function(EVENT_MAP) {
        //maintains lists of subjects by custom event type
        var subscribers = {};

        //used by components to submit raw events to the emitter
        function register(e) {
            var parsedEvent = parseEvent(e);
            publish(parsedEvent);
        }

        function parseEvent(e) {
            var eventProperties = {};

            switch (e.type) {
                case 'timeupdate':
                    eventProperties.detail = {
                        time: e.timeStamp
                    };
                    break;
            }
            eventProperties.cancellable = true;
            eventProperties.bubbles = true;
            return new CustomEvent(EVENT_MAP[e.type], eventProperties);
        }

        //used by the emitter to create custom events to emit to components
        function publish(e) {
            document.dispatchEvent(e);
        }

        function subscribe() {
            console.log('subscribe');
        }

        return {
            register: register,
            subscribe: subscribe
        };
    }
]);

var EVENT_MAP = {
    'timeupdate': 'VIDEO_TIME_EMISSION'
};

IntelligenceWebClient.constant('EVENT_MAP', EVENT_MAP);


