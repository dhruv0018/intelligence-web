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
                data: '=',
                game: '=',
                play: '=',
                events: '=',
                league: '=',
                teamPlayers: '=',
                opposingTeamPlayers: '=',
                videoplayer: '='
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
    function controller() {

    }
]);
