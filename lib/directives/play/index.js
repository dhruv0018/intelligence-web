/* Constants */
let TO = '';
const ELEMENTS = 'E';
const ATTRIBUTES = 'A';

const templateUrl = 'play.html';

/* Fetch angular from the browser scope */
const angular = window.angular;

/* File Dependencies */
import PlayHeader from './play-header/';
import PlayFooter from './play-footer/';
import playTemplate from './template.html';

/**
 * Play
 * @module Play
 */
const Play = angular.module('Play', [
    'Events',
    'PlayHeader',
    'PlayFooter',
    'ui.bootstrap'
]);

/* File Dependencies */
import PlayController from './controller';

/**
 * Play directive.
 * @module Play
 * @name Play
 * @type {directive}
 */
Play.directive('krossoverPlay', krossoverPlay);

krossoverPlay.$inject = [
    'EVENT',
    'PlaylistEventEmitter',
    '$compile',
    '$sce',
    'ROLES',
    'SessionService'
];

function krossoverPlay (
    EVENT,
    playlistEventEmitter,
    $compile,
    $sce,
    ROLES,
    session
) {

    let directive = {

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

        link,

        controller: 'Play.controller',
        controllerAs: 'playController'
    };

    function link (scope, element, attributes) {

        let eventsHTMLString;

        compileScript();

        function compileScript() {

            if (scope.isIndexer) {

                eventsHTMLString = $sce.trustAsHtml(scope.play.indexerScript.join(''));
            } else {

                eventsHTMLString = $sce.trustAsHtml(scope.play.userScript.join(''));
            }

            // TODO: Make sure all of the other scope properties are accounted for.

            let playHTMLString = playTemplate(eventsHTMLString);

            /* Compile Template String */
            element.html(playHTMLString);
            $compile(element.contents())(scope);
        }

        playlistEventEmitter.on(EVENT.PLAYLIST.EVENT.CURRENT_CHANGE, currentEvent => {
            if (currentEvent && scope.play && currentEvent.playId === scope.play.id) compileScript();
        });

        /**
         * Select an event to use as the current event.
         */
        scope.selectEvent = function (eventId) {

            let event = scope.play.events.find(event => event.id === eventId);
            playlistEventEmitter.emit(EVENT.PLAYLIST.EVENT.SELECT, event);
            playlistEventEmitter.emit(EVENT.PLAYLIST.PLAY.SELECT, scope.play);
        };

        const isIndexer = session.currentUser.is(ROLES.INDEXER);

        const currentPlayWatch = scope.$watch('playManager.current', onCurrentPlay);
        const currentPlayEventsLengthWatch = scope.$watch('playManager.current.events.length', onCurrentPlayEventsLength);

        function onCurrentPlay (currentPlay) {

            if (scope.play === currentPlay) {

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

    return directive;
}

export default Play;
