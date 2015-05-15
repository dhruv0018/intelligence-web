import Broker from './broker.js';

const pkg = require('../../package.json');

/* Fetch angular from the browser scope */
const angular = window.angular;

/* Get the injector from angular. */
const injector = angular.element(document).injector();

/* Get dependencies from the injector. */
const VIDEO_PLAYER_EVENTS = injector.get('VIDEO_PLAYER_EVENTS');
const games = injector.get('GamesFactory');
const playManager = injector.get('PlayManager');
const eventManager = injector.get('EventManager');
const currentEventMediator = injector.get('CurrentEventMediator');
const videoPlayerEventEmitter = injector.get('VideoPlayerEventEmitter');

const IntelligenceWebClient = angular.module(pkg.name);

class CurrentEventBroker extends Broker {

    retain () {

        videoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onTimeUpdate);
    }

    resign () {

        videoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_TIME_UPDATE, onTimeUpdate);
    }
}

function onTimeUpdate (timeUpdateEvent) {

    window.requestAnimationFrame(() => {

        let isFinalized;

        let play = playManager.current;

        /* Get the video time. */
        let videoTime = timeUpdateEvent.target.currentTime;

        /* If there is a play and it has events. */
        if (play && play.events) {

            let game = games.get(play.gameId);

            isFinalized = game.isDelivered();

            /* Add events from the current play to the current event mediator. */
            play.events.forEach(pushToMediator);

            /* Flush the current event mediator to find the current event. */
            currentEventMediator.flush();
        }

        /* Push events to the mediator. */
        function pushToMediator (event) {

            let eventTime = event.time;

            /* If the game has been finalized. */
            if (isFinalized) {

                /* Adjust time of the event from the start time of the play. */
                eventTime -= play.startTime;
            }

            /* If event time is before the video time. */
            if (eventTime <= videoTime) {

                /* Push the event to the mediator. */
                currentEventMediator.push(event);
            }
        }
    });
}

angular.$provide.factory('CurrentEventBroker', new CurrentEventBroker());

export default CurrentEventBroker;
