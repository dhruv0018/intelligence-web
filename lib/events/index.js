/* Constants */
var TO = '';
var ELEMENTS = 'E';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Events
 * @module Events
 */
var Events = angular.module('Indexing.Events', [
    'Events.Event'
]);

/* Cache the template file */
Events.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put('indexing/events.html', template);
    }
]);

/**
 * Events directive.
 * @module Events
 * @name Events
 * @type {Directive}
 */
Events.directive('krossoverEvents', [
    function directive() {

        var Events = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                events: '='
            },

            link: link,

            controller: 'Indexing.Events.controller',

            templateUrl: 'indexing/events.html',

        };

        function link($scope, element, attributes) {
        }

        return Events;
    }
]);

/**
 * Events controller.
 * @module Events
 * @name Indexing.Events.controller
 * @type {Controller}
 */
Events.controller('Indexing.Events.controller', [
    '$scope', 'Indexing.EventService',
    function controller($scope, event) {

        /**
         * Select an event.
         */
        $scope.selectEvent = function(selectedEvent) {

            /* Set the current time to the time from the selected event. */
            $scope.VideoPlayer.pause();
            $scope.VideoPlayer.seekTime(selectedEvent.time);

            /* Set the current event to match the selected event. */
            event.current = selectedEvent;
        };
    }
]);
