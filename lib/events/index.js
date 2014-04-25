/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'events.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Events
 * @module Events
 */
var Events = angular.module('Events', [
    'Event'
]);

/* Cache the template file */
Events.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Events directive.
 * @module Events
 * @name Events
 * @type {directive}
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

            controller: 'Events.controller',

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

        }

        return Events;
    }
]);

/**
 * Events controller.
 * @module Events
 * @name Events.controller
 * @type {controller}
 */
Events.controller('Events.controller', [
    '$scope', 'EventsManager',
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
