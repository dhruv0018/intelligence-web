/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'event.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Event
 * @module Event
 */
var Event = angular.module('Event', [
    'Item'
]);

/* Cache the template file */
Event.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Event directive.
 * @module Event
 * @name Event
 * @type {directive}
 */
Event.directive('krossoverEvent', [
    'ROLES', 'SessionService', 'IndexingService',
    function directive(ROLES, session, indexing) {

        var Event = {

            restrict: TO += ELEMENTS,

            replace: true,

            scope: {
                play: '=',
                event: '=',
                select: '&selected'
            },

            link: link,

            templateUrl: templateUrl
        };

        function link($scope, element, attributes) {

            var INDEXER = ROLES.INDEXER;
            var COACH = ROLES.COACH;

            var currentUser = session.currentUser;

            if (currentUser.is(INDEXER)) {

                $scope.items = indexing.buildScript($scope.event);
            }

            else if (currentUser.is(COACH)) {

            }
        }

        return Event;
    }
]);

