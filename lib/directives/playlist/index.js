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
    function directive() {

        var Playlist = {

            restrict: TO += ELEMENTS,

            controller: PlaylistController,
            controllerAs: 'playListController',
            templateUrl: templateUrl,

            replace: true
        };

        return Playlist;
    }
]);

/**
* Playlist controller
*/
PlaylistController.$inject = [
    '$scope',
    'EVENT',
    'VIDEO_PLAYER_EVENTS',
    'ROLES',
    'Mediator',
    'CurrentEventBroker',
    'PlaylistEventEmitter',
    'VideoPlayerEventEmitter',
    'VideoPlayer',
    'SessionService',
    'PlaysManager',
    'PlayManager',
    'EventManager'
];

function PlaylistController (
    $scope,
    EVENT,
    VIDEO_PLAYER_EVENTS,
    ROLES,
    Mediator,
    currentEventBroker,
    playlistEventEmitter,
    VideoPlayerEventEmitter,
    videoPlayer,
    session,
    playsManager,
    playManager,
    eventManager
) {

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
    VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);

    playlistEventEmitter.on(EVENT.PLAYLIST.PLAY.WATCH, changePlay);

    /* Retain the current event broker to be an intermediary between the
     * current video time and the current event. */
    currentEventBroker.retain();

    /**
     * A mediator colleague to change the play.
     * @param {Play} play - the play to change to.
     */
    function changePlay(play) {

        if (playManager.current === play) {

            videoPlayer.seekTime(0);
            return;
        }

        /* Set the current play. */
        playManager.current = play;
        eventManager.current = play.events[0];

        /* Get the video sources from the play. */
        var sources = play.getVideoSources();

        /* Change the video player source. */
        videoPlayer.changeSource(sources);

        /* Wait until the video player can play. */
        VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, function playVideo() {

            videoPlayer.play();
            VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_CAN_PLAY, playVideo);
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

        playlistEventEmitter.removeListener(EVENT.PLAYLIST.PLAY.WATCH, changePlay);
        VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);
    }
}
