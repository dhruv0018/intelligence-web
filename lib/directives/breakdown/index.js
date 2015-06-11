/* Constants */
var TO = '';
var ELEMENTS = 'E';

var templateUrl = 'breakdown.html';

/* Component resources */
var template = require('./template.html');

/* Fetch angular from the browser scope */
var angular = window.angular;

/**
 * Breakdown
 * @module Breakdown
 */
var Breakdown = angular.module('Breakdown', [
    'Play'
]);

/* Cache the template file */
Breakdown.run([
    '$templateCache',
    function run($templateCache) {

        $templateCache.put(templateUrl, template);
    }
]);

/**
 * Breakdown directive.
 * @module Breakdown
 * @name Breakdown
 * @type {directive}
 */
Breakdown.directive('breakdown', [
    function directive() {

        var Breakdown = {

            restrict: TO += ELEMENTS,

            controller: BreakdownController,

            templateUrl: templateUrl,

            replace: true
        };

        return Breakdown;
    }
]);

/**
* Breakdown controller
*/
BreakdownController.$inject = [
    '$scope',
    'EVENT',
    'ROLES',
    'Mediator',
    'CurrentEventBroker',
    'PlaylistEventEmitter',
    'VideoPlayerEventEmitter',
    'VideoPlayer',
    'SessionService',
    'PlaysManager',
    'PlayManager',
    'EventManager',
    'VIDEO_PLAYER_EVENTS'
];

function BreakdownController (
    $scope,
    EVENT,
    ROLES,
    Mediator,
    currentEventBroker,
    playlistEventEmitter,
    VideoPlayerEventEmitter,
    videoPlayer,
    session,
    playsManager,
    playManager,
    eventManager,
    VIDEO_PLAYER_EVENTS
) {

    playsManager.plays = $scope.plays;

    playsManager.calculatePlays();

    $scope.isIndexer = session.currentUser.is(ROLES.INDEXER);
    $scope.showFooter = angular.isUndefined($scope.showFooter) ? true : $scope.showFooter; // Show footer by default
    $scope.showHeader = angular.isUndefined($scope.showHeader) ? true : $scope.showHeader; // Show header by default

    $scope.$on('$destroy', onDestroy);

    /* Retain the current event broker to be an intermediary between the
     * current video time and the current event. */
    currentEventBroker.retain();

    /* Create a new mediator to mediate which play should be played next. */
    var mediator = new Mediator(changePlay, compareStartTimes, matchCriteria);

    /* Listen for video player "video complete" events. */
    VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);

    playlistEventEmitter.on(EVENT.PLAYLIST.PLAY.WATCH, onWatchPlay);

    function onWatchPlay (play) {

        if (playManager.current === play) {

            videoPlayer.seekTime(0);
            videoPlayer.play();
        }

        else changePlay(play);
    }

    /**
     * A mediator colleague to change the play.
     * @param {Play} play - the play to change to.
     */
    function changePlay(play) {

        VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);

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
            VideoPlayerEventEmitter.on(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);
        });
    }

    /**
     * A mediator strategy to compare start times.
     */
    function compareStartTimes(a, b) {

        return a.startTime - b.startTime;
    }

    /**
     * Criteria for mediation.
     */
    function matchCriteria (play) {

        return play.clip &&
            play.hasVisibleEvents &&
            play.isFiltered &&
            play.startTime > (playManager.current ? playManager.current.endTime : 0);
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

        currentEventBroker.resign();
        playlistEventEmitter.removeListener(EVENT.PLAYLIST.PLAY.WATCH, changePlay);
        VideoPlayerEventEmitter.removeListener(VIDEO_PLAYER_EVENTS.ON_CLIP_COMPLETE, onCompleteVideo);
    }
}
