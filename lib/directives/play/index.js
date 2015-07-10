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
    'EVENT',
    'PlaylistEventEmitter',
    '$compile',
    '$sce',
    'ROLES',
    'SessionService',
    function directive (
        EVENT,
        playlistEventEmitter,
        $compile,
        $sce,
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
                isReelsPlay: '=?',
                editFlag: '=?'
            },

            link: link,

            controller: 'Play.controller',
            controllerAs: 'playController',
            templateUrl: templateUrl
        };

        function link ($scope, element, attributes) {

            let eventsHTMLString = $sce.trustAsHtml($scope.play.userScript().join(''));

            let playHTMLString = `
            <div
                ng-hide="!play.hasVisibleEvents && !isIndexer"
                class="play"
                ng-click="selectPlay(play)"
                ng-class="{ active: play.id == playManager.current.id, 'fully-opaque': expandAll, 'play__reel': isReelsPlay, 'edit-mode': editFlag, 'play-selected': play.isSelected }"
            >

                <play-header></play-header>

                <div>

                    <ul
                        class="playBody"
                        ng-hide="editFlag"
                        ng-if="
                            isIndexer ||
                            expandAll ||
                            play === playManager.current ||
                            showPlayBody ||
                            (isReelsPlay && !editFlag && expandAll)"
                        ng-class="{'playHide': (!expandAll && (play != playManager.current || isReelsPlay && editFlag )) && !showPlayBody}"
                    >
                        ${eventsHTMLString}
                    </ul>

                    <play-footer ng-show="showPlayFooter()"></play-footer>

                </div>

            </div>
            `;

            /* Compile Template String */
            element.html(playHTMLString);
            $compile(element.contents())($scope);

            /**
             * Select an event to use as the current event.
             */
            $scope.selectEvent = function (eventId) {

                let event = $scope.play.events.find(event => event.id === eventId);
                playlistEventEmitter.emit(EVENT.PLAYLIST.EVENT.SELECT, event);
            };

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
