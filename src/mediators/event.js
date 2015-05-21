var MEDIATION_TIMEOUT = 300;

var pkg = require('../../package.json');

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

/**
 * @module IntelligenceWebClient
 * @name CurrentEventMediator
 * @type {service}
 */
IntelligenceWebClient.factory('CurrentEventMediator', [
    'Mediator', 'EventManager',
    function(Mediator, eventManager) {

        /* Create a new mediator to mediate what the current event should be. */
        var mediator = new Mediator(changeCurrentEvent, compareTimes);

        /**
         * A mediator colleague to change the current event.
         * @param {Event} event - the event to change to.
         */
        function changeCurrentEvent (event) {

            /* Set the current play. */
            eventManager.current = event;
        }

        /**
         * A mediator strategy to compare times.
         */
        function compareTimes (a, b) {

            /* Sort in descending order. */
            return b.time - a.time;
        }

        return mediator;
    }
]);
