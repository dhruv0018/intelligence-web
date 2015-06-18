/* Constants */
var TO = '';
var ELEMENTS = 'E';
var ATTRIBUTES = 'A';

var templateUrl = 'play.html';

require('play-header');
require('play-footer');

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Play
 * @module Play
 */
var Play = angular.module('Play', [
    'Events',
    'PlayHeader',
    'PlayFooter',
    'ui.bootstrap'
]);

/* Cache the template file */
Play.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Play directive.
 * @module Play
 * @name Play
 * @type {directive}
 */
Play.directive('krossoverPlay', [
    'ROLES',
    'SessionService',
    function directive(
        ROLES,
        session
    ) {

        var Play = {

            restrict: TO += ELEMENTS + ATTRIBUTES,

            scope: {
                game: '=',
                play: '=',
                plays: '=',
                reel: '=?',
                league: '=',
                expandAll: '=?',
                filteredPlaysIds: '=?',
                autoAdvance: '=?',
                isReelsPlay: '=?'
            },

            link: link,

            controller: 'Play.controller',
            controllerAs: 'playController',
            templateUrl: templateUrl
        };

        function link ($scope, element, attributes) {

            const isIndexer = session.currentUser.is(ROLES.INDEXER);

            const currentPlayWatch = $scope.$watch('playManager.current', onCurrentPlay);
            const currentPlayEventsLengthWatch = $scope.$watch('playManager.current.events.length', onCurrentPlayEventsLength);

            function onCurrentPlay (currentPlay) {

                if ($scope.play === currentPlay) {

                    requestAnimationFrame(scrollPlayIntoView);
                }
            }

            function onCurrentPlayEventsLength (newLength, oldLength) {

                if (isIndexer && newLength > oldLength) {

                    requestAnimationFrame(scrollPlayIntoView);
                }
            }

            function scrollPlayIntoView () {

                element[0].scrollIntoView(!isIndexer);
            }

            element.on('$destroy', onDestroy);

            function onDestroy () {

                /* Remove watches. */
                currentPlayWatch();
                currentPlayEventsLengthWatch();
            }
        }

        return Play;
    }
]);

/* File Dependencies */
require('./controller');
