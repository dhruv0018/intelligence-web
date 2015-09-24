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

        template: playTemplate,

        controller: 'Play.controller',
        controllerAs: 'playController'
    };

    function link (scope, element, attributes) {

        const isIndexer = session.currentUser.is(ROLES.INDEXER);

        const currentPlayWatch = scope.$watch('playManager.current', onCurrentPlay);
        const currentPlayEventsLengthWatch = scope.$watch('playManager.current.events.length', onCurrentPlayEventsLength);

        function onCurrentPlay (currentPlay) {

            if (scope.play === currentPlay) {

                requestAnimationFrame(scrollPlayIntoView);
            }
        }

        function onCurrentPlayEventsLength (newLength, oldLength) {

            if (
                !isIndexer &&
                newLength !== oldLength &&
                scope.play === scope.playManager.current
            ) {

                requestAnimationFrame(scrollPlayIntoView);
            }
        }

        function scrollPlayIntoView () {

            if (!isIndexer) element[0].scrollIntoView();
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
