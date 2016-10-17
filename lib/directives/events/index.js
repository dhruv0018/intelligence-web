/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'lib/directives/events/template.html';

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Events
 * @module Events
 */
var Events = angular.module('Events', [
    'Event'
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
                game: '=',
                play: '=',
                plays: '=',
                events: '=',
                league: '=',
                videoplayer: '=',
                autoAdvance: '=?',
                isEditable: '=?'
            },

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            $scope.isEditable = angular.isDefined($scope.isEditable) ? $scope.isEditable : true;

        }

        return Events;
    }
]);

export default Events;
