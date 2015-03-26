/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'playlist.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Playlist
 * @module Playlist
 */
var Playlist = angular.module('Playlist', [
    'Play',
    'ui.bootstrap',
    'ng'
]);

/* Cache the template file */
Playlist.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Playlist directive.
 * @module Playlist
 * @name Playlist
 * @type {directive}
 */
Playlist.directive('krossoverPlaylist', [
    'EventEmitter', 'EVENT_MAP',
    function directive(emitter, EVENT_MAP) {

        var Playlist = {

            restrict: TO += ELEMENTS,

            controller: 'Playlist.controller',

            templateUrl: templateUrl,

            replace: true,
            link: {
                pre: function() {
                },
                post: function(scope, element) {
                }
            }
        };

        return Playlist;
    }
]);

/**
* Playlist controller
*/
Playlist.controller('Playlist.controller', [
    '$scope', 'EVENT_MAP', 'ROLES', 'Mediator', 'EventEmitter', 'VideoPlayer', 'SessionService', 'PlaysManager', 'PlayManager', 'EventManager',
    function controller($scope, EVENT_MAP, ROLES, Mediator, emitter, videoPlayer, session, playsManager, playManager, eventManager) {

        playsManager.plays = $scope.plays;

        $scope.isIndexer = session.currentUser.is(ROLES.INDEXER);
        $scope.showFooter = angular.isUndefined($scope.showFooter) ? true : $scope.showFooter; // Show footer by default
        $scope.showHeader = angular.isUndefined($scope.showHeader) ? true : $scope.showHeader; // Show header by default

        $scope.getPlayCount = function getPlayCount() {
            if ($scope.filteredPlaysIds) {
                return $scope.filteredPlaysIds.length;
            } else {
                return $scope.plays.length;
            }
        };

        $scope.$on('$destroy', onDestroy);

        /* Create a new mediator to mediate which play should be played next. */
        var mediator = new Mediator(changePlay, compareIndices, matchCriteria);

        /* Listen for video player "video complete" events. */
        emitter.subscribe(EVENT_MAP['clip-completion'], onCompleteVideo);

        /**
         * A mediator colleague to change the play.
         * @param {Play} play - the play to change to.
         */
        function changePlay(play) {

            /* Set the current play. */
            playManager.current = play;
            eventManager.current = play.events[0];

            /* Get the video sources from the play. */
            var sources = play.getVideoSources();

            /* Change the video player source. */
            videoPlayer.changeSource(sources);

            /* Wait until the video player can play. */
            emitter.subscribe(EVENT_MAP.canplay, function playVideo() {

                videoPlayer.play();
                emitter.unsubscribe(EVENT_MAP.canplay, playVideo);
            });
        }

        /**
         * A mediator strategy to compare start times.
         */
        function compareIndices(a, b) {

            return a.index - b.index;
        }

        /**
         * Criteria for mediation.
         */
        function matchCriteria (play) {

            return play.clip &&
                play.hasVisibleEvents &&
                play.isFiltered &&
                play.index > playManager.current.index;
        }

        /**
         * When the video completes, perform mediation and play the winning video.
         */
        function onCompleteVideo() {

            /* If continuous play is on. */
            if (playManager.playAllPlays) {

                /* Put each play into pool of plays that should be played next. */
                $scope.plays.forEach(mediator.push.bind(mediator));

                /* Mediate the plays. */
                mediator.flush();
            }
        }

        function onDestroy() {

            emitter.unsubscribe(EVENT_MAP['clip-completion'], onCompleteVideo);
        }
    }
]);
